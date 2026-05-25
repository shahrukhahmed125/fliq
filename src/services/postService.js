import api from '@/api/axios'

export const postService = {
  getPosts: async (params = {}) => {
    const response = await api.get('/posts', { params })
    console.log('GET POSTS RESPONSE:', response.data)
    // Handle Laravel API response structure: { status, message, data: [...] }
    const posts = response.data?.data || response.data || []
    return Array.isArray(posts) ? posts : []
  },

  getPost: async (id) => {
    const response = await api.get(`/posts/show/${id}`)
    console.log('GET POST RESPONSE:', response.data)
    // Handle Laravel API response structure: { status, message, data: {...} }
    return response.data?.data || response.data
  },

  createPost: async (postData, onUploadProgress) => {
    const response = await api.post('/posts/store', postData, {
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onUploadProgress(progress)
        }
      }
    })
    console.log('CREATE POST RESPONSE:', response.data)
    // Handle Laravel API response structure: { status, message, data: {...} }
    return response.data?.data || response.data
  },

  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/update/${id}`, postData)
    console.log('UPDATE POST RESPONSE:', response.data)
    return response.data?.data || response.data
  },

  deletePost: async (id) => {
    const response = await api.delete(`/posts/delete/${id}`)
    console.log('DELETE POST RESPONSE:', response.data)
    return response.data
  },

  toggleLike: async (uuid) => {
    const response = await api.post(`/posts/${uuid}/like`)
    console.log('TOGGLE LIKE RESPONSE:', response.data)
    return response.data?.data || response.data
  },

  getReplies: async (postId) => {
    const response = await api.get(`/posts/${postId}/replies`)
    console.log('GET REPLIES RESPONSE:', response.data)
    // Handle Laravel API response structure: { status, message, data: [...] }
    const replies = response.data?.data || response.data || []
    return Array.isArray(replies) ? replies : []
  },

  createReply: async (replyData) => {
    const response = await api.post('/posts/store', replyData)
    console.log('CREATE REPLY RESPONSE:', response.data)
    // Handle Laravel API response structure: { status, message, data: {...} }
    return response.data?.data || response.data
  },

  deleteReply: async (id) => {
    const response = await api.delete(`/posts/delete/${id}`)
    console.log('DELETE REPLY RESPONSE:', response.data)
    return response.data
  },

  createRepost: async (repostData) => {
    const response = await api.post('/posts/store', repostData)
    console.log('CREATE REPOST RESPONSE:', response.data)
    // Handle Laravel API response structure: { status, message, data: {...} }
    return response.data?.data || response.data
  },
}
