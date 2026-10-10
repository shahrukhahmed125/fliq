import api from '@/api/axios'
import { storageService } from '@/services/storageService'

const INITIAL_POSTS = [
  {
    id: 1,
    uuid: '1',
    user_id: 1,
    user: {
      id: 1,
      name: 'Fliq Studio',
      username: '@fliq',
      profile_photo: '/brand/fliq-app-icon-light.png',
    },
    content: 'Fliq is being shaped as a calmer public square for Pakistan: fast enough for live trends, thoughtful enough for creators, and simple enough to use every day.',
    created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    likes_count: 520,
    replies_count: 16,
    reposts_count: 48,
    is_liked: false,
    is_reposted: false,
    media: [],
  },
  {
    id: 2,
    uuid: '2',
    user_id: 2,
    user: {
      id: 2,
      name: 'Ayesha Khan',
      username: '@ayeshawrites',
      profile_photo: null,
    },
    content: 'A calmer social app for Pakistan should reward useful conversation, not outrage. Imagine trends that help you understand the country without making the feed feel exhausting.',
    created_at: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    likes_count: 2400,
    replies_count: 42,
    reposts_count: 128,
    is_liked: false,
    is_reposted: false,
    media: [],
  },
  {
    id: 3,
    uuid: '3',
    user_id: 3,
    user: {
      id: 3,
      name: 'Hassan Ali',
      username: '@hassanbuilds',
      profile_photo: null,
    },
    content: 'Building in public from Pakistan needs better communities: founders, designers, developers, creators, students. Fliq channels could become that daily space.',
    created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    likes_count: 890,
    replies_count: 18,
    reposts_count: 64,
    is_liked: false,
    is_reposted: false,
    media: [],
  },
  {
    id: 4,
    uuid: '4',
    user_id: 4,
    user: {
      id: 4,
      name: 'Cricket Desk',
      username: '@cricketdesk',
      profile_photo: null,
    },
    content: 'Match thread is live. Keep it sharp, keep it fun, and please remember: every dropped catch does not need a national inquiry.',
    created_at: new Date(Date.now() - 1000 * 60 * 31).toISOString(),
    likes_count: 9800,
    replies_count: 305,
    reposts_count: 710,
    is_liked: false,
    is_reposted: false,
    media: [],
  },
]

const getStoredPosts = () => {
  try {
    const raw = localStorage.getItem('fliq_mock_posts')
    if (raw) return JSON.parse(raw)
  } catch (err) {
    console.error('Failed to parse fliq_mock_posts:', err)
  }
  localStorage.setItem('fliq_mock_posts', JSON.stringify(INITIAL_POSTS))
  return INITIAL_POSTS
}

const saveStoredPosts = (posts) => {
  try {
    localStorage.setItem('fliq_mock_posts', JSON.stringify(posts))
  } catch (err) {
    console.error('Failed to save fliq_mock_posts:', err)
  }
}

const getStoredReplies = (postId) => {
  try {
    const raw = localStorage.getItem(`fliq_mock_replies_${postId}`)
    if (raw) return JSON.parse(raw)
  } catch (err) {
    console.error('Failed to parse replies:', err)
  }
  return []
}

const saveStoredReplies = (postId, replies) => {
  try {
    localStorage.setItem(`fliq_mock_replies_${postId}`, JSON.stringify(replies))
  } catch (err) {
    console.error('Failed to save replies:', err)
  }
}

export const postService = {
  getPosts: async (params = {}) => {
    try {
      if (import.meta.env.VITE_API_URL) {
        const response = await api.get('/posts', { params })
        const posts = response.data?.data || response.data || []
        return Array.isArray(posts) ? posts : []
      }
    } catch (err) {
      console.warn('API /posts failed, falling back to mock posts:', err.message)
    }

    const posts = getStoredPosts()
    if (params.user_id) {
      return posts.filter((p) => String(p.user_id) === String(params.user_id) || String(p.user?.id) === String(params.user_id))
    }
    return posts
  },

  getPost: async (id) => {
    try {
      if (import.meta.env.VITE_API_URL) {
        const response = await api.get(`/posts/show/${id}`)
        return response.data?.data || response.data
      }
    } catch (err) {
      console.warn('API /posts/show failed, falling back to mock:', err.message)
    }

    const posts = getStoredPosts()
    return posts.find((p) => String(p.id) === String(id) || String(p.uuid) === String(id)) || null
  },

  createPost: async (postData, onUploadProgress) => {
    try {
      if (import.meta.env.VITE_API_URL) {
        const response = await api.post('/posts/store', postData, {
          onUploadProgress: (progressEvent) => {
            if (onUploadProgress) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              onUploadProgress(progress)
            }
          }
        })
        return response.data?.data || response.data
      }
    } catch (err) {
      console.warn('API /posts/store failed, falling back to local mock:', err.message)
    }

    if (onUploadProgress) {
      onUploadProgress(100)
    }

    let content = ''
    let media = []

    if (postData instanceof FormData) {
      content = postData.get('content') || ''
      const mediaFiles = postData.getAll('media[]')
      media = mediaFiles.map((file, idx) => ({
        id: Date.now() + idx,
        file_path: URL.createObjectURL(file),
        file_type: file.type?.startsWith('video') ? 'video' : 'image',
        status: 'completed',
      }))
    } else if (postData && typeof postData === 'object') {
      content = postData.content || ''
    }

    const currentUser = storageService.getUser() || {
      id: 1,
      name: 'Fliq Studio',
      username: '@fliq',
      profile_photo: '/brand/fliq-app-icon-light.png',
    }

    const newId = Date.now()
    const newPost = {
      id: newId,
      uuid: `post-${newId}`,
      user_id: currentUser.id,
      user: currentUser,
      content,
      created_at: new Date().toISOString(),
      likes_count: 0,
      replies_count: 0,
      reposts_count: 0,
      is_liked: false,
      is_reposted: false,
      media,
    }

    const posts = getStoredPosts()
    const updated = [newPost, ...posts]
    saveStoredPosts(updated)

    return { status: 'success', data: newPost }
  },

  updatePost: async (id, postData) => {
    try {
      if (import.meta.env.VITE_API_URL) {
        const response = await api.put(`/posts/update/${id}`, postData)
        return response.data?.data || response.data
      }
    } catch (err) {
      console.warn('API /posts/update failed:', err.message)
    }
    return { status: 'success' }
  },

  deletePost: async (id) => {
    try {
      if (import.meta.env.VITE_API_URL) {
        const response = await api.delete(`/posts/delete/${id}`)
        return response.data
      }
    } catch (err) {
      console.warn('API /posts/delete failed:', err.message)
    }

    const posts = getStoredPosts().filter((p) => String(p.id) !== String(id) && String(p.uuid) !== String(id))
    saveStoredPosts(posts)
    return { status: 'success' }
  },

  toggleLike: async (uuid) => {
    try {
      if (import.meta.env.VITE_API_URL) {
        const response = await api.post(`/posts/${uuid}/like`)
        return response.data?.data || response.data
      }
    } catch (err) {
      console.warn('API /posts/:uuid/like failed:', err.message)
    }

    const posts = getStoredPosts()
    const target = posts.find((p) => String(p.id) === String(uuid) || String(p.uuid) === String(uuid))
    if (target) {
      target.is_liked = !target.is_liked
      target.likes_count = target.is_liked ? (target.likes_count || 0) + 1 : Math.max(0, (target.likes_count || 1) - 1)
      saveStoredPosts(posts)
      return { is_liked: target.is_liked, likes_count: target.likes_count }
    }
    return { is_liked: true, likes_count: 1 }
  },

  getReplies: async (postId) => {
    try {
      if (import.meta.env.VITE_API_URL) {
        const response = await api.get(`/posts/${postId}/replies`)
        const replies = response.data?.data || response.data || []
        return Array.isArray(replies) ? replies : []
      }
    } catch (err) {
      console.warn('API /posts/:id/replies failed:', err.message)
    }

    return getStoredReplies(postId)
  },

  createReply: async (replyData) => {
    try {
      if (import.meta.env.VITE_API_URL) {
        const response = await api.post('/posts/store', replyData)
        return response.data?.data || response.data
      }
    } catch (err) {
      console.warn('API /posts/store (reply) failed:', err.message)
    }

    let content = ''
    let parentId = null

    if (replyData instanceof FormData) {
      content = replyData.get('content') || ''
      parentId = replyData.get('parent_id')
    } else if (replyData && typeof replyData === 'object') {
      content = replyData.content || ''
      parentId = replyData.parent_id
    }

    const currentUser = storageService.getUser() || {
      id: 1,
      name: 'Fliq Studio',
      username: '@fliq',
      profile_photo: '/brand/fliq-app-icon-light.png',
    }

    const newReplyId = Date.now()
    const newReply = {
      id: newReplyId,
      uuid: `reply-${newReplyId}`,
      user_id: currentUser.id,
      user: currentUser,
      content,
      created_at: new Date().toISOString(),
      likes_count: 0,
      replies_count: 0,
      reposts_count: 0,
      is_liked: false,
      is_reposted: false,
      media: [],
    }

    if (parentId) {
      const replies = getStoredReplies(parentId)
      saveStoredReplies(parentId, [newReply, ...replies])

      const posts = getStoredPosts()
      const target = posts.find((p) => String(p.id) === String(parentId) || String(p.uuid) === String(parentId))
      if (target) {
        target.replies_count = (target.replies_count || 0) + 1
        saveStoredPosts(posts)
      }
    }

    return newReply
  },

  deleteReply: async (id) => {
    try {
      if (import.meta.env.VITE_API_URL) {
        const response = await api.delete(`/posts/delete/${id}`)
        return response.data
      }
    } catch (err) {
      console.warn('API delete reply failed:', err.message)
    }
    return { status: 'success' }
  },

  createRepost: async (repostData) => {
    try {
      if (import.meta.env.VITE_API_URL) {
        const response = await api.post('/posts/store', repostData)
        return response.data?.data || response.data
      }
    } catch (err) {
      console.warn('API repost failed:', err.message)
    }

    let repostOfId = null
    if (repostData instanceof FormData) {
      repostOfId = repostData.get('repost_of')
    }

    const posts = getStoredPosts()
    const target = posts.find((p) => String(p.id) === String(repostOfId) || String(p.uuid) === String(repostOfId))
    if (target) {
      target.is_reposted = !target.is_reposted
      target.reposts_count = target.is_reposted ? (target.reposts_count || 0) + 1 : Math.max(0, (target.reposts_count || 1) - 1)
      saveStoredPosts(posts)
      return { is_reposted: target.is_reposted, reposts_count: target.reposts_count }
    }

    return { is_reposted: true, reposts_count: 1 }
  },
}
