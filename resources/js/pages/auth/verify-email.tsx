import { Form, Head } from '@inertiajs/react';
import { MailCheck } from 'lucide-react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Verify your email" />

            <div className="space-y-6">
                <div className="rounded-2xl border border-[#eadfd9] bg-[#fffaf9] p-5 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f7e9eb] text-[#7d1933]">
                        <MailCheck size={28} />
                    </div>

                    <h2 className="text-lg font-bold text-[#32191e]">
                        Your account is not verified yet
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#765f63]">
                        We sent a verification link to the email address you
                        used when creating your account.
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#765f63]">
                        Please open your email and click the verification link
                        before trying to log in.
                    </p>
                </div>

                {status === 'verification-link-sent' && (
                    <div className="rounded-xl border border-[#d7f0dd] bg-[#edf9ef] px-3 py-3 text-center text-sm font-medium text-[#235b38]">
                        A new verification link has been sent to your email
                        address.
                    </div>
                )}

                <Form {...send.form()} className="space-y-4 text-center">
                    {({ processing }) => (
                        <>
                            <Button
                                disabled={processing}
                                className="w-full rounded-xl bg-[#7d1933] text-white hover:bg-[#5e1227]"
                            >
                                {processing && <Spinner />}
                                Resend verification email
                            </Button>

                            <TextLink
                                href={logout()}
                                className="mx-auto block text-sm"
                            >
                                Log out
                            </TextLink>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verify your email address',
    description:
        'Your account must be verified before you can access the Balay Alumni system.',
};
