const router = require('express').Router()

const chatDB = {}

router.get('/:id', (req, res)=> {
  const {id} = req.params //arka
  const {from} = req.query //demy
  if(!chatDB[id]){
    chatDB[id] = []
  }
  let results = null
  if(from){
    results = chatDB[id].filter(o=>o.from === from || o.from === id)
  }else{
    const sender = chatDB[id].map(o=> o.from)
    results = Array.from(new Set(sender))
  }
  return res.send({
    success: true,
    message: 'Chat History',
    results
  })
})

router.post('/:id', (req, res)=> {
  const {id} = req.params
  const {from, message} = req.body
  const chat = {
    message,
    from,
    timestamp: new Date().getTime()
  }
  if(!chatDB[id]){
    chatDB[id] = []
    chatDB[from] = []
  }
  chatDB[id].push(chat)
  chatDB[from].push(chat)
  req.socket.emit(id, chat)
  return res.send({
    success: true,
    message: 'Chat Sended!',
    // results: chatDB[from].filter(o=>o.from === id)
  })
})

module.exports = router