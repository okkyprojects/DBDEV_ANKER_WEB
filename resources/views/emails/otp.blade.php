<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Verifikasi Akun Anda</title>
</head>

<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f9f9f9;">
    <div
        style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #eee;">

        <!-- Header -->
        <div style="text-align:center;">
            <img src="{{ asset('images/email/header.png') }}" alt="Header"
                style="width:100%; max-width:600px; display:block;">
        </div>

        <!-- Hero -->
        <div style="text-align:center; padding:30px 20px 10px 20px;">
            <img src="{{ asset('images/email/hero.png') }}" alt="Hero"
                style="max-width:200px; display:block; margin:0 auto;">
        </div>

        <!-- Content -->
        <div style="padding:0 30px 30px 30px; text-align:center; color:#333;">
            <h3 style="margin:20px 0 10px 0; font-size:18px; font-weight:600;">Halo {{ $user?->name ?? 'User' }},</h3>
            <p style="margin:0 0 20px 0; font-size:14px; color:#555;">
                Gunakan kode berikut untuk menyelesaikan proses verifikasi Anda<br>
                Kode OTP Anda adalah:
            </p>

            <!-- OTP -->
            <div style="display:flex; justify-content:center; gap:8px; margin:20px 0;">
                <div
                    style="width:40px; height:40px; border:1px solid #ddd; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:bold; background:#f7f7f7; color:#333;">
                    {{ substr($otp, 0, 1) }}
                </div>
                <div
                    style="width:40px; height:40px; border:1px solid #ddd; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:bold; background:#f7f7f7; color:#333;">
                    {{ substr($otp, 1, 1) }}
                </div>
                <div
                    style="width:40px; height:40px; border:1px solid #ddd; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:bold; background:#f7f7f7; color:#333;">
                    {{ substr($otp, 2, 1) }}
                </div>
                <div
                    style="width:40px; height:40px; border:1px solid #ddd; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:bold; background:#f7f7f7; color:#333;">
                    {{ substr($otp, 3, 1) }}
                </div>
                <div
                    style="width:40px; height:40px; border:1px solid #ddd; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:bold; background:#f7f7f7; color:#333;">
                    {{ substr($otp, 4, 1) }}
                </div>
                <div
                    style="width:40px; height:40px; border:1px solid #ddd; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:bold; background:#f7f7f7; color:#333;">
                    {{ substr($otp, 5, 1) }}
                </div>
            </div>

            <p style="font-size:14px; color:#555; margin:0 0 20px 0;">
                Kode ini hanya berlaku selama <strong>{{ $expiresInMinutes }} menit</strong>
            </p>

            <!-- Important Note -->
            <p style="font-size:13px; color:#333; margin:0 0 5px 0; font-weight:bold;">PENTING:</p>
            <p style="font-size:13px; color:#555; margin:0 0 20px 0; line-height:1.6;">
                Demi keamanan, jangan pernah membagikan kode ini kepada siapa pun, termasuk tim
                {{ config('app.name') }}.<br>
                Kami tidak akan pernah meminta kode Anda.<br><br>
                Jika Anda tidak merasa meminta kode ini, mohon abaikan email ini.
            </p>

            <p style="font-size:14px; color:#333; margin:20px 0 0 0;">
                Terima kasih,<br>
                Tim {{ config('app.name') }} Indonesia
            </p>
        </div>
    </div>
</body>

</html>
