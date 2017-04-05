# walkthrough jquery: http://jquerypagewalkthrough.github.io/example/example.html
'use strict'

### Progress object ###

Progress = (progressDOM) ->
  @statusText = progressDOM.find('.progress-text')
  @bar = progressDOM.find('.progress-bar')
  @progress = 0
  @set @progress
  this

### Todo object ###

Todo = (appDOM, progress, l) ->
  `var i`
  # intialize properties
  @header = appDOM.find('h3')
  @input = appDOM.find('.todo-input')
  @list = appDOM.find('.todo-list')
  @doing = null
  @taskCount = 0
  @doneCount = 0
  @progress = progress
  @storage = null
  @header.text Accent.t('header')
  @input.data 'app', this
  @input.attr 'placeholder', Accent.t('what')
  @list.data 'app', this
  @updateProgress()
  # handler of textbox
  @input.on 'keypress', (e) ->
    keycode = if e.keyCode then e.keyCode else e.which
    _this = $(this)
    if keycode == 13 and _this.val() != ''
      # add list
      _this.data('app').addListItem _this.val()
      _this.val ''
    return
  # internal class Item

  @Item = (todo, value) ->
    @item = $('<span>',
      'class': 'list-group-item'
      'html': value)
    @id = Date.now().toString()
    @item.data 'id', @id
    @item.data 'app', todo
    @item.click (e) ->
      _this = $(this)
      if _this.hasClass('disabled')
        _this.data('app').yiuItem _this
      if _this.hasClass('active')
        app = _this.data('app')
        app.finishItem this
        _this.popover 'destroy'
        return
      _this.popover 'toggle'
      _this.parent().children('.list-group-item').not(_this).popover 'hide'
      return
    # add popover for functionalities
    @item.popover
      trigger: 'manual'
      placement: 'bottom'
      html: 'true'
      content: ->
        ding = $('<button>',
          'class': 'btn btn-default'
          'html': Accent.t('push')).data('item', this).click(->
          item = $(this).data('item')
          $(item).data('app').dingItem item
          $(item).popover 'hide'
          return
        )
        yiu = $('<button>',
          'class': 'btn btn-danger'
          'html': Accent.t('remove')).data('item', this).click(->
          item = $(this).data('item')
          $(item).data('app').yiuItem item
          $(item).popover 'hide'
          return
        )
        div = $('<div>', 'class': 'btn-group').append(ding, yiu)
        div
    @item

  # localstorage
  if typeof Storage != 'undefined'
    # get item
    if localStorage.getItem('tasks') != null
      oldList = JSON.parse(localStorage.getItem('tasks'))
      i = 0
      while i < oldList.length
        @addListItem oldList[i].value
        if oldList[i].done
          @finishItem @doing
        ++i
  if l != undefined
    if Object::toString.call(l) == '[object Array]'
      i = 0
      while i < l.length
        @addListItem l[i]
        ++i
    else
      throw TypeError('Expecting array in the third argument')
  this

Progress::set = (percentage) ->
  if typeof percentage != 'number'
    throw TypeError('Progress object accepts only number')
  if percentage < 0 or percentage > 100
    throw rangeError('Progress object accepts only number between 0 and 100')
  @progress = percentage
  @bar.css 'width', percentage + '%'
  switch true
    when percentage == 0
      @statusText.html Accent.t('status_0')
    when percentage <= 10
      @statusText.html Accent.t('status_1')
    when percentage <= 25
      @statusText.html Accent.t('status_2')
    when percentage <= 50
      @statusText.html Accent.t('status_3')
    when percentage <= 75
      @statusText.html Accent.t('status_4')
    when percentage < 100
      @statusText.html Accent.t('status_5')
    when percentage == 100
      @statusText.html Accent.t('status_6')
  return

Todo::addListItem = (value) ->
  # filter text
  foulLang = 
    from: [
      'diu'
      'pk'
      'on9'
      'lun'
      '7head'
    ]
    to: [
      '屌'
      '仆街'
      '戇鳩'
      '撚'
      '柒頭'
    ]
  i = 0
  while i < foulLang.from.length
    value = value.replace(new RegExp(foulLang.from[i], 'g'), foulLang.to[i])
    ++i
  # not the best way to do this, 
  # add data-binding and handler later
  @list.find('#intro').remove()
  # add to bottom of list
  item = new (@Item)(this, value)
  @list.append item
  if @taskCount - (@doneCount) == 0
    @doing = $(item)
    @activate item
  itemAttributes = {
    id: item.data 'id'
    value: value
    done: false
  }
  if @storage != null
    @storage.push itemAttributes
  else
    @storage = new Array itemAttributes
  # re-calculate progress
  ++@taskCount
  @updateProgress()
  @save()
  return

Todo::activate = (dom) ->
  $(dom).addClass 'active'
  return

Todo::deactivate = (dom) ->
  $(dom).removeClass 'active'
  return

Todo::finish = (dom) ->
  $(dom).removeClass 'active'
  $(dom).addClass 'disabled'
  return

Todo::dingItem = (dom) ->
  # move up an item
  dom = $(dom)
  prev = dom.prev('.list-group-item')
  if prev.hasClass('disabled')
    return
  prev.before dom
  if prev.is(@doing)
    @deactivate prev
    @activate dom
    @doing = dom
  return

Todo::yiuItem = (dom) ->
  # delete an item
  dom = $(dom)
  @removeFromStorage dom.data('id')
  @save()
  dom.popover 'destroy'
  if dom.is(@doing)
    @doing = dom.nextAll('.list-group-item').first()
    @activate @doing
  if dom.hasClass('disabled')
    --@doneCount
  --@taskCount
  dom.remove()
  @updateProgress()
  return

Todo::finishItem = (dom) ->
  if !$(dom).is(@doing)
    # not active item
    return
  ++@doneCount
  @finish dom
  @doing = $(dom).nextAll('.list-group-item').first()
  @activate @doing
  i = 0
  while i < @storage.length
    if !@storage[i].done
      @storage[i].done = true
      break
    ++i
  @updateProgress()
  @save()
  return

Todo::removeFromStorage = (id) ->
  index = -1
  @storage.forEach (item, index_)->
    if item.id == id
      index = index_
  @storage.splice(index, 1) unless index == -1

Todo::save = ->
  if typeof Storage != 'undefined'
    localStorage.setItem 'tasks', JSON.stringify(@storage)
  return

Todo::updateProgress = ->
  if @taskCount == 0
    # not the best way to implement this, 
    # I should add data binding between the list and a variable, 
    # then this sits in the handler for list change
    @list.append $('<h4>',
      'id': 'intro'
      'html': "<em>#{Accent.t('prompt')}</em>"
      'class': 'text-center text-muted')
    @progress.set 0
  else
    @progress.set 100 * @doneCount / @taskCount
  return

### Accent object ###

class Accent
  @KEYS: [
    'push'
    'remove'
    'prompt'
    'status_0'
    'status_1'
    'status_2'
    'status_3'
    'status_4'
    'status_5'
    'status_6'
  ]

  @ACCENTS:
    粗口:
      push: '頂'
      remove: '妖'
      prompt: '加撚野做啦仆街'
      what: '做乜撚野'
      header: '做野啦柒頭'
      status_0: '戇鳩鳩發乜撚夢呀？'
      status_1: '屌廢嘅'
      status_2: '做到2046呀屌'
      status_3: '屌做唔撚完呀'
      status_4: '屌有排先做撚完呀'
      status_5: '就黎做完啦屌'
      status_6: '做完收皮啦'
    en:
      push: 'Move up'
      remove: 'Remove'
      prompt: 'Add a task'
      what: 'I need to do...'
      header: 'Work'
      status_0: 'Better start now than later'
      status_1: 'Keep going'
      status_2: 'You are doing good'
      status_3: 'What will you do after finishing them all?'
      status_4: 'Great progress'
      status_5: 'Almost done!'
      status_6: 'All done!'

  @t: (key)->
    lang = window.location.hash.slice(1)
    lang = if @ACCENTS.hasOwnProperty(lang) then lang else '粗口'
    @ACCENTS[lang][key]

### Main object ###

todoDom = $('#todo-app')
progress = new Progress($('#progress'))
app = new Todo(todoDom, progress)

if(typeof navigator['serviceWorker'] != 'undefined')
  window.addEventListener 'load', ->
    navigator.serviceWorker
      .register('./service-worker.js')
      .then ->
        console.log('Service Worker Registered')
