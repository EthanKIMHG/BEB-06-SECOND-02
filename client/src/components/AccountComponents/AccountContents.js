import React, {useContext} from 'react'
import { AppContext } from '../../AppContext';
import { Dummy } from '../../Dummy';
import { NavLink } from 'react-router-dom';
import Articles from '../Articles';

const AccountArticles = () => {

  const context = useContext(AppContext);

  // context.state.contents

  return (
    <div className='account-contents'>
      <div className='account-contents-info'>
        <h2>Comments</h2>
        <div>
          <NavLink to='/write'><button>Write</button></NavLink>
        </div>
      </div>
      <div className='account-contents-box'>
        <div className='account-contents-only'>
          <div className='account-contents-wrapper'>
          <Articles />
          </div>
          <div className='account-contents-wrapper'>
          <Articles />
          </div>
          <div className='account-contents-wrapper'>
          <Articles />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountArticles