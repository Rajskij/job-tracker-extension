export function buildRow(data) {
    return [[
        data.title,
        data.company,
        data.contact,
        data.website,
        "N/A",
        "N/A",
        "N/A",
        new Date().toLocaleDateString("en-US"),
        "LinkedIn",
        "Not Yet",
        "LinkedIn",
        "N/A",
        "Submitted",
        `Recruiter profile: ${data.profile}, Job Location: ${data.location}, Job link: ${data.jobLink}`
    ]];
};
