<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Verifikasi Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height:1.6;">
    <div style="max-width:600px; margin:0 auto; padding:20px; border:1px solid #eee; border-radius:6px;">
        <h2 style="margin-top:0;">Verifikasi Akun</h2>
        <p>Halo,</p>
        <p>Gunakan kode OTP berikut untuk memverifikasi akun Anda:</p>

        <div style="display:inline-block; padding:12px 18px; font-size:22px; font-weight:700; letter-spacing:2px; background:#f7f7f7; border-radius:6px;">
            {{ $otp }}
        </div>

        <p style="margin-top:16px;">Kode ini berlaku selama <strong>{{ $expiresInMinutes }} menit</strong>.</p>
        <p>Jika Anda tidak meminta kode ini, abaikan email ini.</p>

        <p>Salam,<br>{{ config('app.name') }}</p>
    </div>
</body>
</html>
