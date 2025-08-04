import { chronoApiClient } from '../api/axios.js';
export const getWorlds = async () => {
    const response = await chronoApiClient.get('/api/worlds');
    // Handle different response structures
    if (response.data) {
        return response.data;
    }
    return response;
};
//# sourceMappingURL=WorldsService.js.map