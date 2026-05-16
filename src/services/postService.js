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

  createPost: async (postData) => {
    const response = await api.post('/posts/store', postData)
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

  likePost: async (id) => {
    const response = await api.post(`/posts/${id}/like`)
    console.log('LIKE POST RESPONSE:', response.data)
    return response.data?.data || response.data
  },

  unlikePost: async (id) => {
    const response = await api.delete(`/posts/${id}/like`)
    console.log('UNLIKE POST RESPONSE:', response.data)
    return response.data?.data || response.data
  },

  getComments: async (postId) => {
    const response = await api.get(`/posts/${postId}/comments`)
    console.log('GET COMMENTS RESPONSE:', response.data)
    return response.data?.data || response.data
  },

  createComment: async (postId, commentData) => {
    const response = await api.post(`/posts/${postId}/comments`, commentData)
    console.log('CREATE COMMENT RESPONSE:', response.data)
    return response.data?.data || response.data
  },
}
