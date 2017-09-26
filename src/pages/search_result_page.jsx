import React, { PureComponent } from 'react';
import TodoItem from '../todo_item.jsx';
import { Link } from 'react-router-dom';

class SearchResultPage extends PureComponent {
  searchResultStyle(resultCount) {
    return { display: resultCount === 0 ? 'none' : 'inherit' };
  }

  render() {
    const { results, lists } = this.props;

    return (
      <div>
        {
          Object.keys(results).map((key)=> (
            <div key={`search-list-${key}`} style={ this.searchResultStyle(results[key].length) }>
              <p>
                列 <Link to={`/list/${key}`}>{ lists[key].name }</Link>
              </p>
              <p>{ results[key].length == 0 && '無呀' }</p>
              { results[key].map((todo)=> (<TodoItem listKey={key} {...todo} />)) }
            </div>
          ))
        }
        { Object.values(results).reduce((memo, result)=> (memo + result.length), 0) == 0
            && (<div>無呀</div>) }
      </div>
    );
  }
}

export default SearchResultPage;
