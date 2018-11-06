import test from 'ava'
import sinon from 'sinon'
import simulant from 'simulant'
import TableLink from '../'

test.before(() => {
  document.body.innerHTML = `
  <table id="table">
    <tbody>
      <tr id="self" data-href="http://google.com.br">
        <td></td>
      </tr>
        <tr id="blank" data-href="http://google.com.br" data-target="blank">
          <td>
            <button></button>
          </td>
        </tr>
    </tbody>
  </table>
  <span data-href="http://google.com.br" data-target="blank"> </span>
  <div data-href="http://google.com.br">
    <button></button>
  </div>
`
  global.eventName = 'mouseup';
  global.rowBlank = document.getElementById('blank')
  global.rowSelf = document.getElementById('self')
  global.span = document.querySelector('span')
  global.div = document.querySelector('div')
  global.buttonInsideRow = document.querySelector('tr button')
  global.buttonInsideDiv = document.querySelector('div button')
})

test.beforeEach(() => {
  sinon.spy(window, 'open')
  sinon.spy(location, 'assign')
  global.event = TableLink.init()
})

test.afterEach(() => {
  global.event.destroy()
  window.open.restore()
  location.assign.restore()
})

test('When a table row with [data-target="blank"] a new window should be opened', t => {
  simulant.fire(rowBlank, eventName)
  t.true(window.open.calledOnce)
  t.true(window.open.calledWith(rowBlank.getAttribute('data-href')))
  t.is(window.location.href, 'about:blank')
})

test('When a table row with [data-target="self"] the page should change', t => {
  simulant.fire(rowSelf, eventName)
  t.true(location.assign.calledOnce)
  t.true(location.assign.calledWith(rowSelf.getAttribute('data-href')))
})

test('When a TableLink row is clicked the after and before callback should be called', t => {
  let before = sinon.stub()
  let after = sinon.stub()

  TableLink.before(before)
  TableLink.after(after)

  simulant.fire(rowSelf, eventName)
  simulant.fire(rowBlank, eventName)

  t.true(before.calledTwice)
  t.true(after.calledTwice)
})

test('When the before callback returns false it should cancel the link opening', t => {
  let before = sinon.stub().returns(false)
  let after = sinon.stub()

  TableLink.before(before)
  TableLink.after(after)

  simulant.fire(rowSelf, eventName)
  simulant.fire(rowBlank, eventName)

  t.true(before.called)
  t.false(after.called)
  t.false(window.open.called)
  t.false(location.assign.called)
})

test('If a selector is passed it should turn on a link too', t => {
  event.destroy()
  global.event = TableLink.init('div, span')

  simulant.fire(span, eventName)
  simulant.fire(div, eventName)

  t.true(window.open.calledOnce)
  t.true(window.open.calledWith(rowBlank.getAttribute('data-href')))
  t.is(window.location.href, 'about:blank')
  t.true(location.assign.calledOnce)
  t.true(location.assign.calledWith(rowSelf.getAttribute('data-href')))
})

test('If the clicked target does not matches the selector, nothing should happens', t => {
  event.destroy()
  global.event = TableLink.init('div, span')

  let before = sinon.spy()
  let after = sinon.spy()

  TableLink.before(before)
  TableLink.after(after)

  simulant.fire(buttonInsideRow, eventName)
  simulant.fire(buttonInsideDiv, eventName)

  t.false(window.open.calledOnce)
  t.false(location.assign.calledOnce)
  t.false(before.called)
  t.false(after.called)
})

test('The callbacks should have the event object as the argument', t => {
  let before = sinon.stub()
  let after = sinon.stub()

  TableLink.before(before)
  TableLink.after(after)

  simulant.fire(rowSelf, eventName)

  t.true(before.lastCall.args[0] instanceof Event)
  t.true(after.lastCall.args[0] instanceof Event)
})

test('When a table row was clicked with ctrlKey a new window should be opened', t => {
  simulant.fire(rowSelf, eventName, { ctrlKey: true })
  t.true(window.open.calledOnce)
  t.true(window.open.calledWith(rowSelf.getAttribute('data-href')))
  t.is(window.location.href, 'about:blank')
})

test('When a table row was clicked with middle button a new window should be opened', t => {
  simulant.fire(rowSelf, eventName, { button: 1 })
  t.true(window.open.calledOnce)
  t.true(window.open.calledWith(rowSelf.getAttribute('data-href')))
  t.is(window.location.href, 'about:blank')
})
