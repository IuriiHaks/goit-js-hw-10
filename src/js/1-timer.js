import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  startBtn: document.querySelector('button[data-start]'),
  dateTimePicker: document.querySelector('#datetime-picker'),
  daysSpan: document.querySelector('[data-days]'),
  hoursSpan: document.querySelector('[data-hours]'),
  minutesSpan: document.querySelector('[data-minutes]'),
  secondsSpan: document.querySelector('[data-seconds]'),
};

let selectedDate = null;
let intervalId = null;

refs.startBtn.disabled = true;

const fp = flatpickr(refs.dateTimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const now = new Date();
    selectedDate = selectedDates[0];

    if (selectedDate <= now) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      refs.startBtn.disabled = true;
    } else {
      refs.startBtn.disabled = false;
    }
  },
});

refs.startBtn.addEventListener('click', onStart);

function onStart() {
  refs.startBtn.disabled = true;
  refs.dateTimePicker.disabled = true;

  intervalId = setInterval(() => {
    const now = new Date();
    const delta = selectedDate - now;

    if (delta <= 0) {
      clearInterval(intervalId);
      updateTimerUI(0);
      iziToast.success({
        title: 'Done',
        message: 'Countdown finished!',
        position: 'topRight',
      });
      refs.dateTimePicker.disabled = false;
      return;
    }

    updateTimerUI(delta);
  }, 1000);
}

function updateTimerUI(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);

  refs.daysSpan.textContent = addLeadingZero(days);
  refs.hoursSpan.textContent = addLeadingZero(hours);
  refs.minutesSpan.textContent = addLeadingZero(minutes);
  refs.secondsSpan.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  return {
    days: Math.floor(ms / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor((ms % hour) / minute),
    seconds: Math.floor((ms % minute) / second),
  };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
