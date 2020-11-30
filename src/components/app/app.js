import React, { Component } from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import PostStatusFilter from '../post-status-filter';
import PostList from '../post-list';
import PostAddForm from '../post-add-form';

import './app.css';
import styled from 'styled-components';

const AppBlock = styled.div`
  margin: 0 auto;
  max-width: 800px;
`;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { label: 'Going to learn React', important: true, like: false, id: 1 },
        { label: 'That is so good', important: false, like: false, id: 2 },
        { label: 'I need a break...', important: false, like: false, id: 3 },
      ],
      term: '',
      filter: 'all',
    };

    this.deleteItem = this.deleteItem.bind(this);
    this.addItem = this.addItem.bind(this);
    this.onToggleImportant = this.onToggleImportant.bind(this);
    this.onToggleLiked = this.onToggleLiked.bind(this);
    this.onUpdateSearch = this.onUpdateSearch.bind(this);
    this.onFilterSelect = this.onFilterSelect.bind(this);
  }
  deleteItem(id) {
    this.setState(({ data }) => {
      const index = data.findIndex(elem => elem.id === id);

      const newArr = [...data.slice(0, index), ...data.slice(index + 1)];
      return {
        data: newArr,
      };
    });
  }

  generateId() {
    let string = '';
    for (let i = 0; i < 2; i++) {
      let lowerChar = String.fromCharCode(Math.floor(Math.random() * (122 - 97) + 97));
      let number = Math.floor(Math.random() * (10 - 1) + 0);
      let upperChar = String.fromCharCode(Math.floor(Math.random() * (90 - 65) + 65));
      string += lowerChar + number + upperChar;
    }
    return string;
  }

  addItem(body) {
    let id = this.generateId();
    const newItem = {
      label: body,
      important: false,
      like: false,
      id,
    };
    this.setState(({ data }) => {
      const newArr = [...data, newItem];
      return {
        data: newArr,
      };
    });
  }

  toggleMethod(data, id, toggle) {
    const index = data.findIndex(elem => elem.id === id);
    const old = data[index];
    const newItem = { ...old, [toggle]: !old[toggle] };

    const newArr = [...data.slice(0, index), newItem, ...data.slice(index + 1)];
    return {
      data: newArr,
    };
  }

  onToggleImportant(id) {
    this.setState(({ data }) => {
      return this.toggleMethod(data, id, 'important')
    });
  }

  onToggleLiked(id) {
    this.setState(({ data }) => {
      return this.toggleMethod(data, id, 'like')
    });
  }

  searchPost(items, term) {
    if (term.length === 0) {
      return items;
    }

    return items.filter(item => {
      return item.label.indexOf(term) > -1;
    });
  }

  filterPosts(items, filter) {
    if (filter === 'like') {
      return items.filter(item => item.like);
    } else {
      return items;
    }
  }

  onUpdateSearch(term) {
    this.setState({ term });
  }

  onFilterSelect(filter) {
    this.setState({ filter });
  }

  render() {
    const { data, term, filter } = this.state;

    const liked = data.filter(item => item.like).length;
    const allPosts = data.length;

    const visiblePosts = this.filterPosts(this.searchPost(data, term), filter);

    return (
      <AppBlock>
        <AppHeader liked={liked} allPosts={allPosts} />
        <div className="search-panel d-flex">
          <SearchPanel onUpdateSearch={this.onUpdateSearch} />
          <PostStatusFilter filter={filter} onFilterSelect={this.onFilterSelect} />
        </div>
        <PostList
          posts={visiblePosts}
          onDelete={this.deleteItem}
          onToggleImportant={this.onToggleImportant}
          onToggleLiked={this.onToggleLiked}
        />
        <PostAddForm onAdd={this.addItem} />
      </AppBlock>
    );
  }
}
