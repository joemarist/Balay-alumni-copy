import { Link } from '@inertiajs/react';
import { Leaf, Sparkles } from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="min-h-svh bg-[#fcf8f5] p-4 text-[#27191b] md:p-8">
            <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-[#eadfd9] bg-white shadow-[0_30px_80px_rgba(77,33,45,0.12)]">
                <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
                    <aside className="relative hidden overflow-hidden bg-[#2d171d] p-8 text-white lg:flex lg:flex-col lg:justify-between">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),transparent_30%),linear-gradient(140deg,#2d171d_0%,#4b1d29_48%,#7d1933_100%)]" />
                        <div className="relative z-10">
                            <Link
                                href={home()}
                                className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-3 py-2 backdrop-blur-sm transition hover:bg-white/10"
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#f7d8d8]">
                                    <Leaf size={18} />
                                </span>
                                <span className="text-sm font-semibold tracking-[0.2em] text-white/80 uppercase">
                                    Balay Alumni
                                </span>
                            </Link>
                        </div>

                        <div className="relative z-10 space-y-5">
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#f7d8d8]/30 bg-[#f7d8d8]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#f8dfe1]">
                                <Sparkles size={12} />
                                Venue & café
                            </div>
                            <div className="space-y-4">
                                <h2 className="max-w-xs font-serif text-4xl leading-tight text-white">
                                    A place for meaningful gatherings.
                                </h2>
                                <p className="max-w-sm text-sm leading-7 text-white/70">
                                    Celebrate milestones, reconnect with your community,
                                    and enjoy thoughtfully designed spaces that feel like home.
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#f8dfe1]">
                                Why alumni choose us
                            </div>
                            <div className="grid gap-2 text-sm text-white/75">
                                <div>• Venue planning support</div>
                                <div>• Warm café experience</div>
                                <div>• Community-first atmosphere</div>
                            </div>
                        </div>
                    </aside>

                    <main className="bg-[#fcf8f5] p-5 sm:p-7 lg:p-10">
                        <div className="mx-auto max-w-md">
                            <div className="mb-8 flex items-center justify-between gap-3">
                                <Link
                                    href={home()}
                                    className="inline-flex items-center gap-2 rounded-full border border-[#eadfd9] bg-white px-3 py-1.5 text-sm font-medium text-[#7d1933] shadow-sm transition hover:bg-[#fff6f5]"
                                >
                                    <Leaf size={14} />
                                    Balay Alumni
                                </Link>
                                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8c6e73]">
                                    {title}
                                </div>
                            </div>

                            <div className="space-y-2 text-center lg:text-left">
                                <h1 className="font-serif text-3xl text-[#32191e] sm:text-4xl">
                                    {title}
                                </h1>
                                <p className="text-sm leading-6 text-[#765f63]">
                                    {description}
                                </p>
                            </div>

                            <div className="mt-8">{children}</div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
