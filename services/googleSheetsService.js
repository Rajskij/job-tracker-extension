
export async function findSpreadsheetByName(accessToken, sheetName) {
    const query = `name = '${sheetName}' and trashed = false and (
          mimeType = 'application/vnd.google-apps.spreadsheet' or
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )`;

    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)&includeItemsFromAllDrives=true&supportsAllDrives=true`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    const data = await response.json();

    if (response.ok) {
        if (data.files.length > 0) {
            console.log("Found sheet:", data.files[0]);
            return data.files[0]; // { id, name }
        } else {
            console.warn("Sheet not found", response);
            return null;
        }
    } else {
        console.error("Drive API error:", data);
        return null;
    }
}

export async function appendJobRow(spreadsheetId, accessToken, rowValues) {
    const sheetName = 'Instructions for Job Tracking';
    console.log(rowValues);
    console.log('Spreed sheet id: ', spreadsheetId);

    const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A1:Z1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ values: rowValues }),
        }
    );

    const result = await response.json();
    if (response.ok) {
        console.log("✅ Row added:", result.updates?.updatedRange || "No range returned");
    } else {
        console.error("❌ Error adding row:", result);
    }

    return true;
}

 export async function getAllSheets(accessToken) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?` +
      `q=mimeType='application/vnd.google-apps.spreadsheet'` +
      `&fields=files(id,name,createdTime,modifiedTime,webViewLink)` +
      `&orderBy=name` +
      `&pageSize=1000`, // Maximum allowed by API
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Drive API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.files || [];

  } catch (error) {
    console.error('Failed to fetch sheets:', error);
    throw error; // Re-throw for caller to handle
  }
}
