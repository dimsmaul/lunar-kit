
import Image from 'next/image';

interface GitHubContributor {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    contributions: number;
}

export async function Contributor() {
    try {
        const res = await fetch('https://api.github.com/repos/dimsmaul/lunar-kit/contributors', {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!res.ok) {
            return null;
        }

        const contributors: GitHubContributor[] = await res.json();

        if (!contributors || contributors.length === 0) {
            return null;
        }

        return (
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-4 justify-center">
                    {contributors.map(contributor => (
                        <a
                            key={contributor.id}
                            href={contributor.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-row items-center gap-3 p-2 rounded-full border bg-card hover:bg-accent/50 transition-colors"
                            title={`${contributor.login} (${contributor.contributions} contributions)`}
                        >
                            <Image
                                src={contributor.avatar_url}
                                alt={contributor.login}
                                width={40}
                                height={40}
                                className="rounded-full bg-muted"
                                unoptimized
                            />
                        </a>
                    ))}
                </div>
            </div>
        );
    } catch (error) {
        return null;
    }
}

