export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            message: "Method not allowed",
        });
    }

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "onboarding@resend.dev",
                to: ["nawreshidri796@gmail.com"],
                subject: "New visitor on Nawres Portfolio",
                html: `
          <h2>New visitor on your portfolio</h2>
          <p>Someone opened your website.</p>
          <p><strong>Page:</strong> Home</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        `,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({
                error: data,
            });
        }

        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            error: "Failed to send email",
        });
    }
}