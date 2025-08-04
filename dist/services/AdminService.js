import { trainingApiClient } from '../api/axios.js';
export const AdminList = async () => {
    const response = await trainingApiClient.get('/api/admin');
    // Handle different response structures
    if (response.data) {
        return response.data;
    }
    return response;
};
//# sourceMappingURL=AdminService.js.map