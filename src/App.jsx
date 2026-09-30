import { useState } from 'react'
import ModePicker from './components/ModePicker'
import LessonPicker from './components/LessonPicker'
import Flashcards from './components/Flashcards'
import MultipleChoice from './components/MultipleChoice'
import Matching from './components/Matching'
import SpeedRound from './components/SpeedRound'
import History from './components/History'
import Settings from './components/Settings'
import About from './components/About'
import Drawer from './components/Drawer'
import Welcome from './components/Welcome'
import { MODES } from './data/modes'
import { VOCABULARY } from './data/vocabulary'
import { getStoredName } from './utils/profile'
import { sendFeedback } from './utils/feedback'
import { requestAppReview } from './utils/rateApp'

const GAME_COMPONENTS = {
  flashcards: Flashcards,
  'multiple-choice': MultipleChoice,
  matching: Matching,
  'speed-round': SpeedRound,
}

function App() {
  // 'home' | 'history' | 'settings' | 'about' | 'lessons' | 'game'
  const [screen, setScreen] = useState('home')
  const [modeId, setModeId] = useState(null)
  const [selection, setSelection] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [hasName, setHasName] = useState(() => !!getStoredName())

  if (!hasName) {
    return <Welcome onDone={() => setHasName(true)} />
  }

  function navigateTo(target) {
    setDrawerOpen(false)
    if (target === 'home') {
      setModeId(null)
      setSelection(null)
    }
    setScreen(target)
  }

  const drawer = (
    <Drawer
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      onNavigate={navigateTo}
      activeScreen={screen}
      onSendFeedback={sendFeedback}
      onRateApp={requestAppReview}
    />
  )
  const openMenu = () => setDrawerOpen(true)

  if (screen === 'history') {
    return (
      <>
        {drawer}
        <History onOpenMenu={openMenu} />
      </>
    )
  }

  if (screen === 'settings') {
    return (
      <>
        {drawer}
        <Settings onOpenMenu={openMenu} />
      </>
    )
  }

  if (screen === 'about') {
    return (
      <>
        {drawer}
        <About onOpenMenu={openMenu} />
      </>
    )
  }

  if (screen === 'lessons' || screen === 'game') {
    const mode = MODES.find((m) => m.id === modeId)

    if (screen === 'lessons') {
      return (
        <LessonPicker
          mode={mode.id}
          modeLabel={mode.label}
          onSelectLesson={(lesson) => {
            setSelection({ lesson })
            setScreen('game')
          }}
          onSelectAll={() => {
            setSelection({ all: true })
            setScreen('game')
          }}
          onBack={() => {
            setModeId(null)
            setScreen('home')
          }}
        />
      )
    }

    const words = selection.all
      ? VOCABULARY
      : VOCABULARY.filter((word) => word.lesson === selection.lesson)

    const GameComponent = GAME_COMPONENTS[mode.id]

    return (
      <>
        {drawer}
        <GameComponent
          words={words}
          mode={mode.id}
          modeLabel={mode.label}
          lesson={selection.all ? 'all' : selection.lesson}
          onExit={() => setScreen('lessons')}
          onOpenMenu={openMenu}
        />
      </>
    )
  }

  return (
    <>
      {drawer}
      <ModePicker
        onSelect={(id) => {
          setModeId(id)
          setScreen('lessons')
        }}
        onOpenMenu={openMenu}
      />
    </>
  )
}

export default App
