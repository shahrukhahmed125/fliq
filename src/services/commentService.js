import api from '@/api/axios'

export const commentService = {
  getComments: async (postUuid) => {
    const response = await api.get(`/comments/${postUuid}`)
    console.log('GET COMMENTS RESPONSE:', response.data)
    // Handle Laravel API response structure: { status, message, data: [...] }
    const comments = response.data?.data || response.data || []
    return Array.isArray(comments) ? comments : []
  },

  createComment: async (commentData) => {
    const response = await api.post('/comments/store', commentData)
    console.log('CREATE COMMENT RESPONSE:', response.data)
    // Handle Laravel API response structure: { status, message, data: {...} }
    return response.data?.data || response.data
  },

  deleteComment: async (uuid) => {
    const response = await api.delete(`/comments/delete/${uuid}`)
    console.log('DELETE COMMENT RESPONSE:', response.data)
    return response.data
  },
}
