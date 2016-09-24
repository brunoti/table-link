import test from 'ava'
import sinon from 'sinon'
import simulant from 'simulant'
import TableLink from '../src/TableLink'

test.before(() => {
  document.body.innerHTML = `
  <table id="table">
    <tbody>
      <tr id="self" data-href="http://google.com.br">
        <td></td>
      </tr>
        <tr id="blank" data-href="http://google.com.br" data-target="blank">
          <td></td>
        </tr>
    </tbody>
  </table>
  <span data-href="http://google.com.br" data-target="blank"></span>
  <div data-href="http://google.com.br"></div>
`
  global.rowBlank = document.getElementById('blank')
  global.rowSelf = document.getElementById('self')
  global.span = document.querySelector('span')
  global.div = document.querySelector('div')
})

test.beforeEach(() => {
  sinon.spy(window, 'open')
  sinon.spy(location, 'assign')
  global.event = TableLink.init()
})

test.afterEach(() => {
  global.event.destroy();
  window.open.restore();
  location.assign.restore();
})

test('When a table row with [data-taget="blank"] a new window sould be opened', t => {
  simulant.fire(rowBlank, 'click')
  t.true(window.open.calledOnce)
  t.true(window.open.calledWith(rowBlank.getAttribute('data-href')))
  t.is(window.location.href, 'about:blank')
})

test('When a table row with [data-taget="self"] the page should change', t => {
  simulant.fire(rowSelf, 'click')
  t.true(location.assign.calledOnce)
  t.true(location.assign.calledWith(rowSelf.getAttribute('data-href')))
})

test('When a TableLink row is clicked the after and before callback should be called', t => {
  let before = sinon.stub();
  let after = sinon.stub();

  TableLink.before(before);
  TableLink.after(after);

  simulant.fire(rowSelf, 'click')
  simulant.fire(rowBlank, 'click')

  t.true(before.calledTwice);
  t.true(after.calledTwice);
});

test('When the before callback returns false it should cancel the link opening', t => {
  let before = sinon.stub().returns(false);
  let after = sinon.stub();

  TableLink.before(before);
  TableLink.after(after);

  simulant.fire(rowSelf, 'click')
  simulant.fire(rowBlank, 'click')

  t.true(before.called);
  t.false(after.called);
  t.false(window.open.called);
  t.false(location.assign.called);
});

test('If a selector is passed it should turn on a link too', t => {
  event.destroy();

  TableLink.init('div, span');

  simulant.fire(span, 'click')
  simulant.fire(div, 'click')

  t.true(window.open.calledOnce)
  t.true(window.open.calledWith(rowBlank.getAttribute('data-href')))
  t.is(window.location.href, 'about:blank')
  t.true(location.assign.calledOnce)
  t.true(location.assign.calledWith(rowSelf.getAttribute('data-href')))
});

