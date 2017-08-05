import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TodoItem from '../todo_item.jsx';
import { Link } from 'react-router-dom'

const ListNameStyle = {
  textDecoration: 'underline'
};

class SearchResultPage extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { results, lists } = this.props;

    return (
      <div>
        {
          Object.keys(results).map((key)=> (
            <div key={`search-list-${key}`}>
              <p>
                <Link to={`/list/${key}`}>{ lists[key].name }</Link>
              </p>
              <p>{ results[key].length == 0 && '無呀' }</p>
              { results[key].map((todo)=> (<TodoItem listKey={key} {...todo} />)) }
            </div>
          ))
        }
      </div>
    );
  }
}

export default SearchResultPage;
