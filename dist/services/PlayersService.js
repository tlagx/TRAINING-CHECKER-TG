import { trainingApiClient } from '../api/axios.js';
export const fetchPlayersOnline = async () => {
    const response = await trainingApiClient.get('/api/online');
    // Handle different response structures
    if (response.data && response.data.data) {
        return response.data.data;
    }
    return response.data || response;
};
//# sourceMappingURL=PlayersService.js.map