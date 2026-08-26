// Encode an AudioBuffer to a WAV file (PCM 16-bit)
// Supports mono or stereo
export function encodeWAV(audioBuffer) {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length * numChannels * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);

  // Write WAV header
  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  let offset = 0;
  writeString(view, offset, 'RIFF'); offset += 4;
  view.setUint32(offset, length - 8, true); offset += 4;
  writeString(view, offset, 'WAVE'); offset += 4;
  writeString(view, offset, 'fmt '); offset += 4;
  view.setUint32(offset, 16, true); offset += 4; // Subchunk1Size
  view.setUint16(offset, 1, true); offset += 2; // PCM
  view.setUint16(offset, numChannels, true); offset += 2;
  view.setUint32(offset, sampleRate, true); offset += 4;
  view.setUint32(offset, sampleRate * numChannels * 2, true); offset += 4;
  view.setUint16(offset, numChannels * 2, true); offset += 2;
  view.setUint16(offset, 16, true); offset += 2; // bits per sample
  writeString(view, offset, 'data'); offset += 4;
  view.setUint32(offset, length - offset - 4, true); offset += 4;

  // Write interleaved PCM samples
  const channels = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(audioBuffer.getChannelData(i));
  }
  let sampleIdx = 0;
  while (sampleIdx < audioBuffer.length) {
    for (let ch = 0; ch < numChannels; ch++) {
      let sample = channels[ch][sampleIdx];
      sample = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
    sampleIdx++;
  }
  return buffer;
} 