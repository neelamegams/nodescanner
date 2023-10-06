import http from 'k6/http';
import { sleep } from 'k6';
export const options = {
  vus: 1,
  duration: '5s',
};

export default function () {
  // Request page containing a form
  let res = http.get('http://localhost:3000');
  
  // Now, submit form setting/overriding some fields of the form
  res = res.submitForm({
    formSelector: 'form'
  });
  sleep(2);
}