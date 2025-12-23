import React from 'react';
import { Github, Star, ExternalLink, Book, History } from 'lucide-react';

export default function GitHubStats({ githubData, github_url }) {
    if (!githubData) return null;

    const { repositories, contributionsCollection } = githubData;
    const { contributionCalendar } = contributionsCollection;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Heatmap Section */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-muted flex items-center gap-2">
                        <History size={14} /> GitHub Contributions
                    </h2>
                    <span className="text-xs text-muted font-medium">
                        {contributionCalendar.totalContributions} contributions in the last year
                    </span>
                </div>
                
                <div className="bg-card border border-border rounded-2xl p-4 overflow-x-auto no-scrollbar">
                    <div className="flex gap-0.75 min-w-max md:min-w-0 md:justify-center">
                        {contributionCalendar.weeks.map((week, wIdx) => (
                            <div key={wIdx} className="flex flex-col gap-0.75">
                                {week.contributionDays.map((day, dIdx) => (
                                    <div
                                        key={dIdx}
                                        title={`${day.contributionCount} contributions on ${day.date}`}
                                        className="
                                            /* Sizing: Smaller on desktop to ensure it fits without scrolling */
                                            w-2.5 h-2.5
                                            md:w-2.25 md:h-2.25
                                            lg:w-2.5 lg:h-2.5
                                            rounded-xl
                                            transition-all
                                            hover:scale-125 hover:z-10
                                        "
                                        style={{ 
                                            backgroundColor: day.contributionCount > 0 
                                                ? day.color 
                                                : 'rgba(243, 244, 246, 0.05)', 
                                            border: day.contributionCount > 0 ? 'none' : '1px solid rgba(255,255,255,0.05)'
                                        }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Repositories Section */}
            <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted mb-4 flex items-center gap-2">
                    <Book size={14} /> Top Repositories
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {repositories.nodes.map((repo) => (
                        <a
                            key={repo.url}
                            href={repo.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-col p-4 border border-border rounded-2xl hover:bg-foreground/5 transition-all group relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-sm truncate pr-6 group-hover:text-primary transition-colors">
                                    {repo.name}
                                </h3>
                                <ExternalLink size={14} className="text-muted absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            
                            <p className="text-xs text-muted line-clamp-2 mb-4 grow">
                                {repo.description || "No description provided."}
                            </p>

                            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-tight text-muted">
                                {repo.primaryLanguage && (
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: repo.primaryLanguage.color }} />
                                        {repo.primaryLanguage.name}
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <Star size={12} /> {repo.stargazerCount}
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
                
                <div className="mt-6">
                    <a 
                        href={github_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-muted/20 border border-border rounded-xl text-xs font-bold text-muted hover:text-foreground hover:bg-muted/40 transition-all"
                    >
                        <Github size={14} /> View full GitHub profile
                    </a>
                </div>
            </section>
        </div>
    );
}