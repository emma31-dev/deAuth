export default async function getUserData(){
    const url = process.env.API_END_POINT + '/user';
    
    try {
        const response = await fetch(url);
        
        if(!response.ok) {
            throw new Error(`Failed to get user data, status: ${response.status}`)
        }
        const userData = await response.json();
    }
    catch {
        throw console.error(`Failed to get user data, status: ${response.status}`);
    }
}