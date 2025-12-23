import React, { useState } from 'react';
import { SquareChevronRight, SquareChevronLeft } from "lucide-react"
import logo from "../../assets/icons/gradnet-logo.png"
import LeftSidebar from "./leftSidebar.jsx"
import RightSidebar from "./RightSidebar.jsx"
const MainLayout = ({ children }) => {
    const [leftOpen, setLeftOpen] = useState(false);
    const [rightOpen, setRightOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">

            {/* Mobile Header*/}
            <header className="lg:hidden flex justify-between items-center p-1 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-40">
                <button onClick={() => setLeftOpen(true)} className="p-2"><SquareChevronRight /></button>
                <img src={logo} alt="Logo" className="w-8 h-8" />
                <button onClick={() => setRightOpen(true)} className="p-2"><SquareChevronLeft /></button>
            </header>

            <div className="flex-1 lg:grid lg:grid-cols-[300px_1fr_350px] max-w-400 mx-auto w-full">

                {/* LEFT SIDEBAR */}
                <section className={`
                    fixed inset-y-0 left-0 z-50 w-70 transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:block
                        ${leftOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <div className="h-full border-r border-border bg-background">
                        <LeftSidebar closeMobile={() => setLeftOpen(false)} />
                    </div>
                </section>

                {/* CENTER CONTENT */}
                <main className="flex-1 w-full min-w-0 px-0 py-0 md:px-4 md:py-6 lg:px-8">
                    {children}
                </main>

                {/* RIGHT SIDEBAR */}
                <section className={`
                    fixed inset-y-0 right-0 z-50 w-75 transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:block
                        ${rightOpen ? 'translate-x-0' : 'translate-x-full'}
                `}>
                    <div className="h-full border-l border-border bg-background">
                        <RightSidebar closeMobile={() => setRightOpen(false)} />
                    </div>
                </section>

                {(leftOpen || rightOpen) && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => { setLeftOpen(false); setRightOpen(false); }}
                    />
                )}
            </div>
        </div>
    );
};

export default MainLayout;