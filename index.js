var amount = 0;
    const amt = document.getElementById('amount');

    function My_Fun(e) {
      var key = e.key;
      console.log(key);
      

      if (key === 'q') {
        e.preventDefault();
        amount = amount + 100;
        amt.value = amount;
      } else if (key === 'w') {
        e.preventDefault();
        amount = amount + 200;
        amt.value = amount;
      } else if (key === 'e') {
        e.preventDefault();
        amount = amount + 300;
        amt.value = amount;
      } else if (key === 'r') {
        e.preventDefault();
        amount = amount + 400;
        amt.value = amount;
      } else if (key === 't') {
        e.preventDefault();
        amount = amount + 500;
        amt.value = amount;
      }
      else if(key =='0'){
        e.preventDefault();
        amount=0;
      }
    }

    amt.addEventListener('keydown', My_Fun);