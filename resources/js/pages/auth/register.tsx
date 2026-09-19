import { Form, Head, Link } from '@inertiajs/react';
import { ArrowRight, Leaf } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { home, login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Register" />

            <div className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7d1933] text-white shadow-lg shadow-[#7d1933]/20">
                            <Leaf size={18} />
                        </span>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#8c6e73]">
                                Join the community
                            </p>
                            <p className="font-serif text-xl text-[#32191e]">
                                Balay Alumni
                            </p>
                        </div>
                    </div>
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-2 rounded-full border border-[#eadfd9] bg-white px-3 py-1.5 text-xs font-semibold text-[#7d1933] transition hover:bg-[#fff6f5]"
                    >
                        Back home
                    </Link>
                </div>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password', 'password_confirmation']}
                    disableWhileProcessing
                    className="flex flex-col gap-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-sm font-medium text-[#4b2f34]">
                                        Full name
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Full name"
                                        className="h-11 rounded-xl border-[#eadfd9] bg-white px-3.5 text-sm text-[#27191b] shadow-sm transition focus-visible:border-[#7d1933] focus-visible:ring-[#7d1933]/20"
                                    />
                                    <InputError message={errors.name} className="mt-1" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-[#4b2f34]">
                                        Email address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="email@example.com"
                                        className="h-11 rounded-xl border-[#eadfd9] bg-white px-3.5 text-sm text-[#27191b] shadow-sm transition focus-visible:border-[#7d1933] focus-visible:ring-[#7d1933]/20"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-sm font-medium text-[#4b2f34]">
                                        Password
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="Password"
                                        passwordrules={passwordRules}
                                        className="h-11 rounded-xl border-[#eadfd9] bg-white px-3.5 text-sm text-[#27191b] shadow-sm transition focus-visible:border-[#7d1933] focus-visible:ring-[#7d1933]/20"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation" className="text-sm font-medium text-[#4b2f34]">
                                        Confirm password
                                    </Label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Confirm password"
                                        passwordrules={passwordRules}
                                        className="h-11 rounded-xl border-[#eadfd9] bg-white px-3.5 text-sm text-[#27191b] shadow-sm transition focus-visible:border-[#7d1933] focus-visible:ring-[#7d1933]/20"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 h-11 w-full rounded-xl bg-[#7d1933] text-sm font-bold text-white shadow-lg shadow-[#7d1933]/20 transition hover:bg-[#5e1227]"
                                    tabIndex={5}
                                    data-test="register-user-button"
                                >
                                    {processing && <Spinner />}
                                    Create account
                                    {!processing && <ArrowRight size={16} className="ml-2" />}
                                </Button>
                            </div>

                            <div className="rounded-2xl border border-[#eadfd9] bg-[#fffaf9] p-3 text-center text-sm text-[#765f63]">
                                Already have an account?{' '}
                                <TextLink href={login()} tabIndex={6} className="font-semibold text-[#7d1933]">
                                    Log in
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Enter your details below to create your account',
};
