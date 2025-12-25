import db from "../config/database.js";

// Create Mentor
export const CreateMentor = async (userId, mentorData) => {
    const {
        category = 'General', 
        guidance_on, 
        description, 
        external_link = '', 
        max_mentees = 1
    } = mentorData;

    try {
        const result = await db.query(
            `
            INSERT INTO 
                mentor_ship (mentor_id, category, guidance_on, description, external_link, max_mentees)
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *
            `,
            [userId, category, guidance_on, description, external_link, max_mentees]
        );

        return result.rows[0];
    } catch (error) {
        console.error("Database Error in CreateMentor:", error);
        throw new Error("Database insertion failed");
    }
}

// Update Mentor
export const UpdateMentor = async (mentorshipId, userId, mentorData) => {
    const { category, guidance_on, description, external_link, max_mentees } = mentorData;

    const fields = [];
    const values = [];
    let queryIndex = 1;

    if (category !== undefined) { fields.push(`category = $${queryIndex++}`); values.push(category); }
    if (guidance_on !== undefined) { fields.push(`guidance_on = $${queryIndex++}`); values.push(guidance_on); }
    if (description !== undefined) { fields.push(`description = $${queryIndex++}`); values.push(description); }
    if (external_link !== undefined) { fields.push(`external_link = $${queryIndex++}`); values.push(external_link); }
    if (max_mentees !== undefined) { fields.push(`max_mentees = $${queryIndex++}`); values.push(max_mentees); }

    if (fields.length === 0) throw new Error("No fields provided for update.");

    values.push(mentorshipId);
    values.push(userId);

    try {
        const query = `
            UPDATE mentor_ship 
            SET ${fields.join(', ')}, 
                updated_at = CURRENT_TIMESTAMP, -- Only update this timestamp
                is_active = false,
                approval_status = 'pending'
            WHERE id = $${queryIndex} AND mentor_id = $${queryIndex + 1}
            RETURNING *;
        `;

        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Database Error in UpdateMentor:", error);
        throw new Error("Failed to update mentor profile.");
    }
};

// Create mentee
export const CreateMentee = async (mentorshipId, menteeId, requestMessage) => {
    try {
        const result = await db.query(
            `
            INSERT INTO mentorship_enrollments (mentorship_id, mentee_id, request_message)
            VALUES ($1, $2, $3)
            RETURNING *;
            `,
            [mentorshipId, menteeId, requestMessage || "No message provided."]
        );

        return result.rows[0];
    } catch (error) {
        console.error("Database Error in CreateMentee:", error);
        
        if (error.constraint === 'unique_enrollment') {
            throw new Error("unique_enrollment");
        }
        
        throw new Error("Database insertion failed");
    }
}

// Mentor approvals to mentee applications
export const UpdateEnrollmentStatus = async (enrollmentId, mentorId, newStatus, mentorNotes) => {
    try {
        const result = await db.query(
            `
            UPDATE mentorship_enrollments e
            SET status = $1, 
                mentor_notes = $2,
                actioned_at = CURRENT_TIMESTAMP
            FROM mentor_ship m
            WHERE e.id = $3 
              AND e.mentorship_id = m.id 
              AND m.mentor_id = $4
            RETURNING e.*;
            `,
            [newStatus, mentorNotes || null, enrollmentId, mentorId]
        );

        return result.rows[0];
    } catch (error) {
        console.error("Database Error in UpdateEnrollmentStatus:", error);
        throw new Error("Failed to update application status.");
    }
}

// Mentee applications for mentor
export const GetApplicationsForMentor = async (mentorId) => {
    try {
        const query = `
            SELECT 
                e.id AS enrollment_id,
                e.status,
                e.request_message,
                e.applied_at,
                m.guidance_on,
                u.id AS student_id,
                u.name AS student_name,
                u.profile_picture_url AS student_avatar
            FROM mentorship_enrollments e
            JOIN mentor_ship m ON e.mentorship_id = m.id
            JOIN users u ON e.mentee_id = u.id
            WHERE m.mentor_id = $1
            ORDER BY e.applied_at DESC;
        `;

        const result = await db.query(query, [mentorId]);
        return result.rows;
    } catch (error) {
        console.error("Database Error in GetApplicationsForMentor:", error);
        throw new Error("Could not fetch applications.");
    }
};

// Mentee applied status
export const GetStudentApplications = async (studentId) => {
    try {
        const query = `
            SELECT 
                e.id AS enrollment_id,
                e.status,
                e.request_message,
                e.applied_at,
                e.mentor_notes,
                m.guidance_on,
                m.category,
                u.name AS mentor_name,
                u.profile_picture_url AS mentor_avatar
            FROM mentorship_enrollments e
            JOIN mentor_ship m ON e.mentorship_id = m.id
            JOIN users u ON m.mentor_id = u.id
            WHERE e.mentee_id = $1
            ORDER BY e.applied_at DESC;
        `;

        const result = await db.query(query, [studentId]);
        return result.rows;
    } catch (error) {
        console.error("Database Error in GetStudentApplications:", error);
        throw new Error("Could not fetch your applications.");
    }
};

// Get active mentorships
export const GetAllActiveMentorships = async (filters = {}) => {
    const { category, search, limit = 10, offset = 0 } = filters;
    let queryIndex = 1;
    const values = [];
    
    let query = `
        SELECT 
            m.*, 
            u.name AS mentor_name, 
            u.profile_picture_url AS mentor_avatar
        FROM mentor_ship m
        JOIN users u ON m.mentor_id = u.id
        WHERE m.is_active = true 
          AND m.approval_status = 'approved'
    `;

    if (category) {
        query += ` AND m.category = $${queryIndex++}`;
        values.push(category);
    }

    if (search) {
        query += ` AND m.guidance_on ILIKE $${queryIndex++}`;
        values.push(`%${search}%`);
    }

    query += ` ORDER BY m.created_at DESC LIMIT $${queryIndex++} OFFSET $${queryIndex++}`;
    values.push(limit, offset);

    try {
        const result = await db.query(query, values);
        return result.rows;
    } catch (error) {
        console.error("Database Error in GetAllActiveMentorships:", error);
        throw new Error("Could not fetch mentorship listings.");
    }
};

export const ApproveMentorProfile = async (mentorshipId, adminId, status) => {
    try {
        const isActive = status === 'approved';

        const result = await db.query(
            `
            UPDATE mentor_ship 
            SET approval_status = $1, 
                is_active = $2,
                approved_by = $3,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING *;
            `,
            [status, isActive, adminId, mentorshipId]
        );

        return result.rows[0];
    } catch (error) {
        console.error("Database Error in ApproveMentorProfile:", error);
        throw new Error("Failed to update mentor approval status.");
    }
};

export const GetPendingMentorships = async () => {
    try {
        const query = `
            SELECT 
                m.*, 
                u.name AS mentor_name, 
                u.profile_picture_url AS mentor_avatar
            FROM mentor_ship m
            JOIN users u ON m.mentor_id = u.id
            WHERE m.approval_status = 'pending'
            ORDER BY m.created_at ASC;
        `;
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error("Database Error in GetPendingMentorships:", error);
        throw new Error("Could not fetch pending mentorships.");
    }
};