// ============================================================================
// 应用主入口
// ============================================================================

import React from 'react'
import { FireworksLanding } from '@ember-glow/fireworks/react'

/**
 * 应用主组件
 *
 * 现在使用共享包 @ember-glow/fireworks 中的组件
 *
 * 在你的项目中使用：
 *    import { FireworksLanding } from '@ember-glow/fireworks/react'
 *
 *    export default function InitialPage() {
 *      const navigate = useNavigate()
 *
 *      return (
 *        <FireworksLanding
 *          onEnter={() => navigate('/home')}
 *        />
 *      )
 *    }
 */

function App() {
  const handleEnter = () => {
    console.log('用户点击了进入系统按钮')
    // 这里可以跳转到主页面，例如使用 React Router
    // navigate('/home')
    alert('欢迎进入烟火漫游系统！\n(在实际项目中这里会路由到主页面)')
  }

  return (
    <div>
      <FireworksLanding
        onEnter={handleEnter}
      />
    </div>
  )
}

export default App

