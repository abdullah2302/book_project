export async function handleApiResponse(response) {

    if (response.status === 429) {
        const data = await response.json();
        alert(data.message || "Too many requests. Please slow down and try again later.");
        return null;
    }
    
    return response;
}