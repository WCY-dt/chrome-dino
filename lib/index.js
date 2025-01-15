import DinoGame from './game/DinoGame.js'

function genBgm() {
  const SAMPLE_RATE = 8000
  const NUM_SAMPLES = SAMPLE_RATE * 20 // 20s

  const NUM_CHANNELS = 1
  const BITS_PER_SAMPLE = 16

  const SUB_CHUNK2_SIZE = (NUM_SAMPLES * NUM_CHANNELS * BITS_PER_SAMPLE) / 8
  const BYTE_RATE = (SAMPLE_RATE * NUM_CHANNELS * BITS_PER_SAMPLE) / 8
  const BLOCK_ALIGN = (NUM_CHANNELS * BITS_PER_SAMPLE) / 8

  const bytes = new Uint8Array(44 + SUB_CHUNK2_SIZE)
  const view = new DataView(bytes.buffer)

  view.setUint32(0, 0x52494646) // "RIFF"
  view.setUint32(4, 36 + SUB_CHUNK2_SIZE, true)
  view.setUint32(8, 0x57415645) // "WAVE"
  view.setUint32(12, 0x666d7420) // "fmt "
  view.setUint32(16, 16, true) // Subchunk1Size (PCM = 16)
  view.setUint16(20, 1, true) // AudioFormat (PCM = 1)
  view.setUint16(22, NUM_CHANNELS, true)
  view.setUint32(24, SAMPLE_RATE, true)
  view.setUint32(28, BYTE_RATE, true)
  view.setUint16(32, BLOCK_ALIGN, true)
  view.setUint16(34, BITS_PER_SAMPLE, true)
  view.setUint32(36, 0x64617461) // "data"
  view.setUint32(40, SUB_CHUNK2_SIZE, true)

  const soundData = new Uint16Array(bytes.buffer, 44)
  soundData.fill(0) // Fill with silence

  const blob = new Blob([bytes], { type: 'audio/wav' })
  return URL.createObjectURL(blob)
}

const bgmUrl = genBgm()

function playBgm() {
  audioElem.src = bgmUrl
  audioElem.play()
}

playBgm()

const game = new DinoGame(600, 150)

if ('mediaSession' in navigator) {
  const handlePause = () => {
    game.onInput('jump')
  }

  navigator.mediaSession.setActionHandler('pause', handlePause)
}

game.start().catch(console.error)
