




export function handlePostPromise(promise, res) {

    promise
      .then((response) => {
        console.log("res Result",response)
        res.status(200).send(response);
      })
      .catch((error) => {
        console.log(error)
        res.status(500).send(error);
      });
  }


