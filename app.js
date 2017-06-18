class TodoEditor extends React.Component {
    constructor(props) {
        super(props);

        this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
        this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    handleTextAreaChange(evt) {
        this.props.handleChange(evt);
    }

    handleAddButtonClick(evt) {
        this.props.handleClick(evt);
    }

    handleFilterChange(evt) {
        this.props.handleFilterChange(evt);
    }

    render() {
        return (
            <div className="container bg-success todo-editor">
                <div className="row">
                    <div className="col-md-12">
                        <textarea className="form-control todo-editor-textarea"
                                  rows="3"
                                  onChange={this.handleTextAreaChange}
                                  value={this.props.text}></textarea>
                    </div>
                    <div className="col-sm-9">
                        <form className="form-horizontal">
                            <div className="form-group">
                                <label className="col-sm-2 control-label">Отображать </label>
                                <div className="col-sm-10">
                                    <select className="form-control" onChange={this.handleFilterChange}>
                                        <option>Все</option>
                                        <option>Новые</option>
                                        <option>Завершенные</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-sm-3">
                        <button className="btn btn-success pull-right col-sm-12"
                                onClick={this.handleAddButtonClick}>
                            Add <span className="glyphicon glyphicon-plus"></span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

class TodoGrid extends React.Component {
    constructor(props) {
        super(props);

        this.handleTodoItemClick = this.handleTodoItemClick.bind(this);
        this.handleCloseItemClick = this.handleCloseItemClick.bind(this);
    }

    handleTodoItemClick(evt) {
        this.props.handleTodoClick(evt);
    }

    handleCloseItemClick(evt) {
        this.props.hadleCloseClick(evt);
    }

    render() {
        return (
            <div className="container todo-grid">
                <div className="row">
                    {
                        this.props.todoList.filter(todo => {
                            return this.props.filter === 0 ||
                                this.props.filter === 1 && !todo.done ||
                                this.props.filter === 2 && todo.done;
                        }).map(todo => {
                            const className = "col-lg-3 col-md-4 col-sm-6 todo-item" + (todo.done ? " done" : "");
                            return (
                                <div className={className}
                                     id={todo.id}
                                     key={todo.id}>
                                    <span className="todo-item-close"
                                          onClick={this.handleCloseItemClick}>x</span>
                                    <p onClick={this.handleTodoItemClick}>{todo.text}</p>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

class TodoList extends React.Component {
    constructor(props) {
        super(props);

        this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
        this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
        this.handleTodoItemClick = this.handleTodoItemClick.bind(this);
        this.handleCloseItemClick = this.handleCloseItemClick.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);

        this.state = {
            todoList: localStorage.todoList ? JSON.parse(localStorage.todoList) : [],
            text: '',
            filter: 0
        };
    }

    /**
     * Generates new GUID
     * @returns {string}
     */
    newGuid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    setFocusOnTextArea() {
        document.querySelector('.todo-editor-textarea').focus();
    }

    handleTextAreaChange(evt) {
        this.setState({
            text: evt.target.value
        });
    }

    handleFilterChange(evt) {
        this.setState({
            filter: evt.target.selectedIndex
        });
    }

    handleAddButtonClick() {
        if (!this.state.text) {
            return;
        }

        let todoList = this.state.todoList;
        todoList.push({
            id: this.newGuid(),
            text: this.state.text,
            done: false
        });
        this.setState({
            todoList: todoList,
            text: ''
        }, this.setFocusOnTextArea);
        localStorage.todoList = JSON.stringify(todoList);
    }

    handleTodoItemClick(evt) {
        let todoList = this.state.todoList.map(todo => {
            todo.done = todo.id === evt.target.parentNode.id ? !todo.done : todo.done;
            return todo;
        });
        this.setState({
            todoList: todoList
        });
    }

    handleCloseItemClick(evt) {
        let todoList = this.state.todoList.filter(todo => todo.id !== evt.target.parentNode.id);
        this.setState({
            todoList: todoList
        });
    }

    render() {
        return (
            <div className="todo-list">
                <TodoEditor handleChange={this.handleTextAreaChange}
                            handleClick={this.handleAddButtonClick}
                            handleFilterChange={this.handleFilterChange}
                            text={this.state.text}
                            filter={this.state.filter} />
                <TodoGrid todoList={this.state.todoList}
                          handleTodoClick={this.handleTodoItemClick}
                          hadleCloseClick={this.handleCloseItemClick}
                          filter={this.state.filter} />
            </div>
        );
    }
}

ReactDOM.render(
    <TodoList/>,
    document.querySelector(".todo-list-container")
);