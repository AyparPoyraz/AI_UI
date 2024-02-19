const assistant = document.querySelector('.assistant');

navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const audioContext = new AudioContext();
    const analyzer = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyzer);

    // Ses seviyesini 0 ile 100 arasında bir değere dönüştürmek için gerekli olan ayarlamalar
    const minDecibels = -90;
    const maxDecibels = -10;
    const range = maxDecibels - minDecibels;

    // Asistanın başlangıç boyutu
    let initialSize = 100;

    // Ses seviyesine bağlı olarak asistanın boyutunu ayarlayan fonksiyon
    const updateAssistantSize = () => {
      const dataArray = new Uint8Array(analyzer.frequencyBinCount);
      analyzer.getByteFrequencyData(dataArray);

      // Ses seviyesini hesaplıyoruz
      const sum = dataArray.reduce((a, b) => a + b, 0);
      const avg = sum / dataArray.length;
      const volume = ((avg - minDecibels) / range) * 100;

      // Ses seviyesine bağlı olarak asistanın boyutunu güncelliyoruz
      const newSize = initialSize + volume;
      assistant.style.width = newSize + 'px';
      assistant.style.height = newSize + 'px';

      requestAnimationFrame(updateAssistantSize);
    };

    updateAssistantSize();
  })
  .catch(err => {
    console.error('Ses izni reddedildi veya bir hata oluştu:', err);
  });
