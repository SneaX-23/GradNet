import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class GitHubService {
    static generateAppJwt() {
        const privateKey = process.env.GITHUB_PRIVATE_KEY;

        if (!privateKey) {
            throw new Error("GITHUB_PRIVATE_KEY is not defined in environment variables.");
        }

        if (!privateKey.includes('-----BEGIN RSA PRIVATE KEY-----')) {
            throw new Error("GITHUB_PRIVATE_KEY error!");
        }

        const now = Math.floor(Date.now() / 1000);

        const payload = {
            iat: now - 60,
            exp: now + (9 * 60), 
            iss: process.env.GITHUB_APP_ID,
        };

        const formattedKey = privateKey.replace(/\\n/g, '\n');

        try {
            return jwt.sign(payload, formattedKey, { algorithm: 'RS256' });
        } catch (error) {
            console.error("JWT Signing Error:", error.message);
            throw error;
        }
    }

    static async getInstallationToken() {
        const appJwt = this.generateAppJwt();
        try {
            const installations = await axios.get('https://api.github.com/app/installations', {
                headers: { Authorization: `Bearer ${appJwt}`, Accept: 'application/vnd.github+json' }
            });
            const installationId = installations.data[0].id;

            const response = await axios.post(`https://api.github.com/app/installations/${installationId}/access_tokens`, {}, {
                headers: { Authorization: `Bearer ${appJwt}`, Accept: 'application/vnd.github+json' }
            });
            return response.data.token;
        } catch (error) {
            console.error("GitHub Auth Error:", error.response?.data || error.message);
            throw new Error("Failed to authenticate with GitHub");
        }
    }

    static async getGitHubData(githubUsername) {
        const token = await this.getInstallationToken();
        
        const query = `
        query($username: String!) {
          user(login: $username) {
            repositories(first: 10, orderBy: {field: UPDATED_AT, direction: DESC}, privacy: PUBLIC) {
              nodes {
                name
                description
                url
                stargazerCount
                primaryLanguage { name color }
                updatedAt
              }
            }
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                    color
                  }
                }
              }
            }
          }
        }`;

        try {
            const response = await axios.post('https://api.github.com/graphql', 
                { query, variables: { username: githubUsername } },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data.data.user;
        } catch (error) {
            throw new Error("Failed to fetch GraphQL data from GitHub");
        }
    }
}