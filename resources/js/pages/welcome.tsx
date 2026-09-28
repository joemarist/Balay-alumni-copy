import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, CalendarCheck, Check, ChevronDown, Coffee, Leaf, Menu, Star, X } from 'lucide-react';
import { useState } from 'react';
import { dashboard, login, register } from '@/routes';

type WelcomeVenue = {
    id: number;
    name: string;
    description: string;
    category: 'Function Hall' | 'Conference' | 'Whole Venue';
    minimum_capacity_pax: number;
    maximum_capacity_pax: number;
    rate: string | number;
    rate_duration: string;
    inclusions: string[];
    note: string | null;
    image: string | null;
    available: boolean;
};

type Props = {
    auth: {
        user?: {
            name?: string;
        } | null;
    };
    venues: WelcomeVenue[];
};
const nav = [['Venues', 'venues'], ['Packages', 'packages'], ['Café', 'cafe'], ['Our story', 'story'], ['Contact', 'contact']];
const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
type Package = [string, string, string, string, string[]];
const packages: Package[] = [
    ['Halo', 'Essential', '₱25,000', 'A thoughtful foundation for intimate gatherings.', ['Venue rental for 4 hours', 'Tables and chairs for 50 guests', 'Basic sound system', 'Event coordinator']],
    ['Dungan', 'Most loved', '₱55,000', 'Everything you need to bring a meaningful event to life.', ['Venue rental for 8 hours', 'Tables and chairs for 150 guests', 'Full sound and lighting', 'Premium floral arrangements', 'Café orders for 50 guests']],
    ['Balay', 'Signature', '₱95,000', 'A complete, elevated experience for your biggest moments.', ['Full-day venue access', 'Premium AV and lighting', 'Full décor and theming', 'Gourmet catering for 300 guests', 'Photo and video coverage']],
];
const menu = [
    ['Signature Espresso', 'Rich double shot, house-roasted beans.', '₱95', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&h=450&fit=crop&auto=format'],
    ['Creamy Cappuccino', 'Velvety microfoam with a bold base.', '₱120', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&h=450&fit=crop&auto=format'],
    ['Butter Croissant', 'Freshly baked, golden, and flaky.', '₱80', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=450&fit=crop&auto=format'],
    ['Pesto Pasta', 'Al dente pasta with house-made pesto.', '₱195', 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&h=450&fit=crop&auto=format'],
];

export default function Welcome() {
    const { auth, venues } = usePage<Props>().props;

    const [open, setOpen] = useState(false);
    const [selectedVenue, setSelectedVenue] =
        useState<WelcomeVenue | null>(null);
    const cta = auth.user ? dashboard() : register();
    const close = () => setOpen(false);

    return <>
        <Head title="Venue, café, and memories" />
        <div className="min-h-screen overflow-x-hidden bg-[#fcf8f5] text-[#27191b]">
            <header className="sticky top-0 z-50 border-b border-[#eadfd9] bg-[#fcf8f5]/95 backdrop-blur-md">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
                    <button onClick={() => go('home')} className="flex items-center gap-3 text-left"><span className="flex size-10 items-center justify-center rounded-xl bg-[#7d1933] text-white shadow-lg"><Leaf size={19} /></span><span className="leading-none"><strong className="block font-serif text-lg">Balay Alumni</strong><small className="mt-1 block text-[9px] font-semibold uppercase tracking-[.24em] text-[#8c6e73]">Venue & café</small></span></button>
                    <nav className="hidden items-center gap-8 text-sm font-medium text-[#725b5e] lg:flex">{nav.map(([label, id]) => <button key={id} onClick={() => go(id)} className="hover:text-[#7d1933]">{label}</button>)}</nav>
                    <div className="hidden items-center gap-3 sm:flex">{auth.user ? <Link href={dashboard()} className="rounded-xl bg-[#7d1933] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5e1227]">My dashboard</Link> : <><Link href={login()} className="px-3 py-2 text-sm font-semibold text-[#7d1933]">Sign in</Link><Link href={register()} className="rounded-xl bg-[#7d1933] px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-[#5e1227]">Start planning</Link></>}</div>
                    <button onClick={() => setOpen(!open)} className="p-2 text-[#7d1933] sm:hidden" aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
                </div>
                {open && <div className="border-t border-[#eadfd9] px-5 py-5 sm:hidden"><div className="flex flex-col gap-4 text-sm font-medium text-[#725b5e]">{nav.map(([label, id]) => <button key={id} onClick={() => {
 go(id); close();
}} className="text-left">{label}</button>)}<Link href={cta} onClick={close} className="rounded-xl bg-[#7d1933] px-4 py-3 text-center font-semibold text-white">{auth.user ? 'My dashboard' : 'Start planning'}</Link></div></div>}
            </header>
            <main>
                <section id="home" className="relative overflow-hidden"><div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,#f1d5d4,transparent_35%),linear-gradient(135deg,#fcf8f5,#f5e9e6)]" /><div className="relative mx-auto grid min-h-170 max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:py-24"><div className="max-w-xl"><div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#dcb9bd] bg-white/60 px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#7d1933]"><Star size={13} fill="currentColor" /> Where alumni reunite</div><h1 className="font-serif text-5xl font-semibold leading-[1.02] tracking-tight text-[#32191e] sm:text-7xl">Make room for <em className="font-normal text-[#9b4053]">meaningful</em> moments.</h1><p className="mt-7 max-w-lg text-lg leading-8 text-[#765f63]">A warm space for celebrations, conversations, and the memories you will carry home. Plan your next gathering at Balay Alumni.</p><div className="mt-9 flex flex-wrap gap-3"><Link href={cta} className="inline-flex items-center gap-2 rounded-xl bg-[#7d1933] px-6 py-3.5 text-sm font-bold text-white shadow-xl hover:bg-[#5e1227]">Reserve your space <ArrowRight size={16} /></Link><button onClick={() => go('venues')} className="inline-flex items-center gap-2 rounded-xl border border-[#cbaeb0] bg-white/50 px-6 py-3.5 text-sm font-bold text-[#7d1933] hover:bg-white">Explore venues <ChevronDown size={16} /></button></div><div className="mt-12 flex flex-wrap gap-8 border-t border-[#ddc9c7] pt-7"><div><strong className="block font-serif text-3xl text-[#7d1933]">2,800+</strong><span className="text-xs uppercase tracking-wide text-[#8c6e73]">events hosted</span></div><div><strong className="block font-serif text-3xl text-[#7d1933]">15k+</strong><span className="text-xs uppercase tracking-wide text-[#8c6e73]">happy alumni</span></div><div><strong className="block font-serif text-3xl text-[#7d1933]">25</strong><span className="text-xs uppercase tracking-wide text-[#8c6e73]">years of service</span></div></div></div><div className="relative mx-auto w-full max-w-2xl lg:pl-10"><img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&h=1100&fit=crop&auto=format" alt="Warmly lit event venue prepared for a celebration" className="relative aspect-[.92] w-full rounded-4xl object-cover shadow-2xl" /><div className="absolute -bottom-6 -left-2 rounded-2xl bg-white p-4 shadow-xl sm:-left-8"><div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-[#f6e9e7] text-[#7d1933]"><CalendarCheck size={22} /></span><div><strong className="block text-sm">Your moment starts here</strong><span className="text-xs text-[#8c6e73]">Venues available today</span></div></div></div></div></div></section>
                <section id="venues" className="scroll-mt-20 bg-white py-24"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#9b4053]">Find your setting</p><h2 className="font-serif text-4xl leading-tight text-[#32191e] sm:text-5xl">Spaces that feel<br /><em className="font-normal">like yours.</em></h2></div><p className="max-w-sm text-sm leading-7 text-[#765f63]">Choose an intimate room for a thoughtful gathering or take over the whole venue for a celebration to remember.</p></div>

                <div className="grid gap-6 md:grid-cols-3">
                {venues.map((venue) => (
                    <article
                        key={venue.id}
                        onClick={() => setSelectedVenue(venue)}
                        className="group cursor-pointer overflow-hidden rounded-2xl border border-[#eadfd9] bg-[#fcf8f5] transition hover:-translate-y-1 hover:shadow-xl"
                    >
                        <div className="relative h-64 overflow-hidden">
                            <img
                                src={
                                    venue.image ||
                                    '/images/venue/venue-functionhall.png'
                                }
                                alt={venue.name}
                                loading="lazy"
                                className="size-full object-cover transition duration-700 group-hover:scale-105"
                            />

                            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase text-[#7d1933]">
                                {venue.category}
                            </span>
                        </div>

                        <div className="p-6">
                            <h3 className="font-serif text-2xl text-[#32191e]">
                                {venue.name}
                            </h3>

                            <p className="mt-2 text-sm text-[#765f63]">
                                {venue.minimum_capacity_pax}–
                                {venue.maximum_capacity_pax} guests ·{' '}
                                {venue.rate_duration}
                            </p>

                            <div className="mt-6 flex items-center justify-between border-t border-[#eadfd9] pt-4">
                                <span className="font-serif text-xl text-[#7d1933]">
                                    ₱{Number(venue.rate).toLocaleString()}
                                    <small className="ml-1 font-sans text-xs text-[#8c6e73]">
                                        / session
                                    </small>
                                </span>

                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setSelectedVenue(venue);
                                    }}
                                    className="text-sm font-bold text-[#7d1933]"
                                >
                                    View details
                                    <ArrowRight
                                        className="ml-1 inline"
                                        size={14}
                                    />
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

                </div></section>
                <section id="packages" className="scroll-mt-20 bg-[#f5ebe8] py-24"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="mx-auto mb-12 max-w-xl text-center"><p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#9b4053]">Plan with ease</p><h2 className="font-serif text-4xl text-[#32191e] sm:text-5xl">Thoughtfully prepared<br /><em className="font-normal">for every occasion.</em></h2></div><div className="grid gap-6 md:grid-cols-3">{packages.map(([name, eyebrow, price, description, features], index) => <article key={name} className={`relative flex flex-col rounded-2xl border p-7 ${index === 1 ? 'border-[#7d1933] bg-[#7d1933] text-white shadow-2xl md:-translate-y-3' : 'border-[#e0cdca] bg-white/65'}`}>{index === 1 && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#e6a9af] px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-[#5e1227]">Most loved</span>}<p className={`text-xs font-bold uppercase tracking-[.2em] ${index === 1 ? 'text-[#f7d8d8]' : 'text-[#9b4053]'}`}>{eyebrow}</p><h3 className="mt-3 font-serif text-3xl">{name}</h3><p className={`mt-3 text-sm leading-6 ${index === 1 ? 'text-white/75' : 'text-[#765f63]'}`}>{description}</p><p className={`mt-7 font-serif text-3xl ${index === 1 ? 'text-white' : 'text-[#7d1933]'}`}>{price}<small className="ml-1 font-sans text-xs opacity-60">starting</small></p><ul className="mt-7 space-y-3 border-t border-current/15 pt-6 text-sm">{features.map(feature => <li key={feature} className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0 text-[#4b9568]" />{feature}</li>)}</ul><Link href={cta} className={`mt-8 rounded-xl px-4 py-3 text-center text-sm font-bold ${index === 1 ? 'bg-white text-[#7d1933]' : 'border border-[#bd969c] text-[#7d1933]'}`}>Choose {name}</Link></article>)}</div></div></section>
                <section id="cafe" className="scroll-mt-20 bg-white py-24"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="mb-12"><p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#3d8657]">Pause, sip, stay awhile</p><h2 className="font-serif text-4xl text-[#32191e] sm:text-5xl">Good coffee makes<br /><em className="font-normal">good company better.</em></h2></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{menu.map(([name, description, price, image]) => <article key={name} className="overflow-hidden rounded-2xl border border-[#eadfd9] bg-[#fcf8f5]"><img src={image} alt={name} loading="lazy" className="h-44 w-full object-cover" /><div className="p-5"><h3 className="font-serif text-xl text-[#32191e]">{name}</h3><p className="mt-2 min-h-10 text-xs leading-5 text-[#765f63]">{description}</p><div className="mt-4 flex justify-between"><span className="font-bold text-[#7d1933]">{price}</span><Coffee size={16} className="text-[#3d8657]" /></div></div></article>)}</div></div></section>
                <section id="story" className="scroll-mt-20 bg-[#32191e] px-5 py-24 text-center text-white sm:px-8"><div className="mx-auto max-w-2xl"><p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#e6a9af]">More than a venue</p><h2 className="font-serif text-4xl sm:text-5xl">A place to come back to.</h2><p className="mt-6 text-base leading-8 text-white/65">Balay means home. We built this space so the alumni community always has somewhere to gather, celebrate, and create new stories together.</p><Link href={cta} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-bold text-[#7d1933]">Start planning <ArrowRight size={16} /></Link></div></section>
                <section id="contact" className="scroll-mt-20 bg-[#f5ebe8] px-5 py-20 text-center sm:px-8"><h2 className="font-serif text-4xl text-[#32191e] sm:text-5xl">Let’s make it <em className="font-normal text-[#9b4053]">worth remembering.</em></h2><p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#765f63]">events@balayalumni.ph · +63 82 123 4567</p><Link href={cta} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#7d1933] px-7 py-4 text-sm font-bold text-white">Start planning your event <ArrowRight size={16} /></Link></section>
            </main>
            <footer className="bg-[#211216] px-5 py-10 text-white sm:px-8"><div className="mx-auto flex max-w-7xl items-center justify-between gap-6"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-lg bg-[#7d1933]"><Leaf size={17} /></span><span className="font-serif text-lg">Balay Alumni</span></div><span className="text-right text-xs text-white/45">Balay Alumni Complex, Davao City<br />© {new Date().getFullYear()} Balay Alumni</span></div></footer>

            {selectedVenue && (
            <div
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                onClick={() => setSelectedVenue(null)}
            >
                <div
                    className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="relative">
                        <img
                            src={
                                selectedVenue.image ||
                                '/images/venue/venue-functionhall.png'
                            }
                            alt={selectedVenue.name}
                            className="h-64 w-full object-cover sm:h-80"
                        />

                        <button
                            type="button"
                            onClick={() => setSelectedVenue(null)}
                            className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-[#7d1933] shadow"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 sm:p-8">
                        <span className="text-xs font-bold uppercase tracking-[.2em] text-[#9b4053]">
                            {selectedVenue.category}
                        </span>

                        <h2 className="mt-2 font-serif text-3xl text-[#32191e]">
                            {selectedVenue.name}
                        </h2>

                        <p className="mt-4 leading-7 text-[#765f63]">
                            {selectedVenue.description}
                        </p>

                        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <div className="rounded-xl bg-[#fcf8f5] p-4">
                                <p className="text-xs text-[#8c6e73]">
                                    Capacity
                                </p>
                                <p className="mt-1 font-semibold text-[#32191e]">
                                    {selectedVenue.minimum_capacity_pax}–
                                    {selectedVenue.maximum_capacity_pax} pax
                                </p>
                            </div>

                            <div className="rounded-xl bg-[#fcf8f5] p-4">
                                <p className="text-xs text-[#8c6e73]">
                                    Rate
                                </p>
                                <p className="mt-1 font-semibold text-[#32191e]">
                                    ₱{Number(selectedVenue.rate).toLocaleString()}
                                </p>
                            </div>

                            <div className="rounded-xl bg-[#fcf8f5] p-4">
                                <p className="text-xs text-[#8c6e73]">
                                    Duration
                                </p>
                                <p className="mt-1 font-semibold text-[#32191e]">
                                    {selectedVenue.rate_duration}
                                </p>
                            </div>
                        </div>

                        {selectedVenue.inclusions?.length > 0 && (
                            <div className="mt-6">
                                <h3 className="font-semibold text-[#32191e]">
                                    What's included
                                </h3>

                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                    {selectedVenue.inclusions.map((inclusion) => (
                                        <div
                                            key={inclusion}
                                            className="flex items-center gap-2 text-sm text-[#765f63]"
                                        >
                                            <Check
                                                size={16}
                                                className="shrink-0 text-emerald-600"
                                            />
                                            {inclusion}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedVenue.note && (
                            <p className="mt-6 rounded-xl bg-[#f5ebe8] p-4 text-sm text-[#7d1933]">
                                {selectedVenue.note}
                            </p>
                        )}

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => setSelectedVenue(null)}
                                className="rounded-xl border border-[#cbaeb0] px-6 py-3 text-sm font-semibold text-[#7d1933]"
                            >
                                Close
                            </button>

                            <a
                                href="/venues"
                                className="flex-1 rounded-xl bg-[#7d1933] px-6 py-3 text-center text-sm font-bold text-white hover:bg-[#5e1227]"
                            >
                                Book Now
                                <ArrowRight
                                    className="ml-2 inline"
                                    size={16}
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </div>
    </>;
}
