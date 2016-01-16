import React from 'react';
import { Collapse, Button } from 'react-bootstrap';

const performRedirect = (path) => (
  window.location.href = path
);

const val = (prop) => (
  Object.keys(prop).join(' ')
);

const redirect = {
  github: () => performRedirect('/auth/github'),
  reddit: () => performRedirect('/auth/reddit'),
  twitter: () => performRedirect('/auth/twitter'),
  facebook: () => performRedirect('/auth/facebook'),
  google: () => performRedirect('/auth/google')
};


export const LeftIconButton = (props) => (
  <button
    type="button"
    {...props}>
    {props.children}
  </button>
);


export const LoginWith = (account) => (
  <div style={{maxWidth: '350px', margin: '8px auto'}}>
  <LeftIconButton
    block
    className={'btn btn-block social-btn social-btn-' + val(account)}
    onClick={redirect[val(account)]}>
    <LeftFa {...account} />
    &nbsp;Sign in with {val(account)}
  </LeftIconButton>
  </div>
);


export const LeftFa = (icon) => (
  <span
    style={{float: 'left'}}
    className={'fa fa-' + val(icon) + ' fix-left'}/>
);

export const Fa = (icon) => (
  <span className={'fa fa-' + val(icon)}/>
);


export const Logo = ({
  size = 'auto'
  }) => (
  <span style={{fontWeight: 'bold', fontSize: size, fontFamily: 'Hack'}}>
    <span style={{color: '#E26262'}}>
      React
    </span>
    <span style={{color: 'grey'}}>
      athon
    </span>
  </span>
);
export const Center = ({
  children
}) => (
  <section style={{textAlign: 'center'}}>
    {children}
  </section>
);

export const Icon = ({
  name
  }) => (
  <span className={'icon icon-' + name}/>
);

export const Alert = ({
  children,
  kind = 'info'
  }) => (
  <div className={'alert alert-' + kind}>
    {children}
  </div>
);

const selectAll = (e) => {
  let target = e.target;
  target.setSelectionRange(0, target.value.length);
};

export const PastaLink = ({
  label,
  value
}) => (
  <div className='form-group'>
    <label>{label}</label>
    <input
      className='form-control'
      readOnly
      type='text' value={value} onClick={selectAll} />
  </div>
);

const Title = ({
  children
}) => (
  <strong>
    {children}
  </strong>
);


export const Radio = ({
  name,
  value,
  children,
  onChange,
  set
}) => (
  <label className="radio-inline">
  <input
    onChange = {onChange}
    checked = {set === value}
    type = 'radio'
    name = {name}
    id = {name}
    value = {value} />
    {children}
  </label>
);

export const Expander = ({
  isExpanded = false,
  title,
  children,
  onToggle
}) => (
  <span>
    <Title>
      <Button kind="link btn-sm" onClick={onToggle}>
        {title}
        &nbsp;
        <Icon name={isExpanded ? 'caret-down' : 'caret-right'}/>
      </Button>
    </Title>
    <Collapse in={isExpanded}>
      <div>
        {children}
      </div>
    </Collapse>
  </span>
);
