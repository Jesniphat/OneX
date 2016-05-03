var React   = require('react');
var Reflux  = require('reflux');
var T       = require('react-translate-component');
var tr      = require('counterpart');
var DatePicker = require('react-datepicker');

var system  = require('ss-system');

var helper  = system.helper;
var FlexIcon = require('./flex-icon.jsx');


var SearchRow = React.createClass({
  getInitialState: function() {

  },

  componentWillReceiveProps: function(nextProps) {

  },

  render: function() {
    var searchRow = null;
    if (this.props.search) {
      var tmp = this.props.fields.map(function(field) {
        if (field.type==='actions') {
          return (
            <td key={field.name}>
              <div className="flex actions">
                <FlexIcon icon="search100" title="action.search" onClick={this.doSearch}></FlexIcon>
                <FlexIcon icon="clear5" title="action.clearSearch" onClick={this.clearSearch}></FlexIcon>
              </div>
            </td>
          )
        }
        var component;
        if (field.type=='date') {
          component = (
            <DatePicker
              dateFormat="DD/MM/YYYY"
              selected={this.state.keywords[field.name]}
              onChange={function(date) {this.updateKeyword(field.name, date, true)}.bind(this)}
              />);
        } else if (field.type=='lov') {
          if (this.state.lov[field.name]) {
            var optList = this.state.lov[field.name].map(function(item) {
              return (
                <option key={item.value} value={item.value}>{item.text}</option>
              )
            });
            optList.unshift(<option key="-1" value=""></option>);
          }
          component = (
            <select
              ref={'lov_' + field.name}
              className="lov"
              value={this.state.keywords[field.name] || ''}
              onChange={function(e) {this.updateKeyword(field.name, e.target.value, true)}.bind(this)}
              >
              {optList}
            </select>
          )
        } else if (field.search===false) {
          component = (
            <div>{field.text || ''}</div>
          );
        } else {
          var title = null;
          if (field.type=='daterange') {
            title = 'ตัวอย่างวันที่ 15/9/20015\n'
              + '15/9/2015 30/9/2015\n'
              + '15/9/2558 30/9/2558\n'
              + '15/9/2015 - 30/9/2015';
          }
          component = (
            <input
              type="text"
              className="search"
              value={this.state.keywords[field.name]}
              title={title}
              onChange={function(e) {this.updateKeyword(field.name, e.target.value, false)}.bind(this)}
              onKeyDown={function(e) {if (e.keyCode==13) {this.doSearch(e)}}.bind(this)}
            />
          );
        }
        var width;
        if (field.width) {
          width = (parseInt(field.width)-8) + 'px';
        }
        return (
          <td key={field.name} style={{width:width}}>
            {component}
          </td>
        );
      }.bind(this));
      searchRow = (
        <tr className="searchRow">
          {tmp}
        </tr>
      );
    }
    return searchRow;
  }
});

var FlexGrid = React.createClass({
  // shouldComponentUpdate: function(nextProps, nextState) {
  //   if (nextProps==this.props) {
  //     return false;
  //   }
  //   if (nextProps.sortBy == this.props.sortBy
  //     && nextProps.sortDir == this.props.sortDir
  //     && nextProps.page == this.props.page
  //     && nextProps.limit && nextProps.limit == this.props.limit
  //     && JSON.stringify(nextProps.keywords) == JSON.stringify(this.props.keywords)
  //     && nextProps.data
  //     && nextProps.data.length == this.props.data.length
  //     && JSON.stringify(nextProps.data) == JSON.stringify(this.props.data)
  //   ) {
  //     return false;
  //   }
  //   return true;
  // },

  componentWillReceiveProps: function(props) {
    if (this.props.keywords) {
      this.state.props.keywords = helper.clone(this.props.keywords);
    }
  },

  getInitialState: function() {
    var userSession = system.sessionStore.getSession();
    this.cookieName = 'ss-flex-grid-' + (this.props.id || '') + '-' + userSession.staff.id;
    var setting = helper.getCookie(this.cookieName, '');
    if (setting=='') {
      this.setting = {
        sortBy: this.props.sortBy || 'id',
        sortDir: this.props.sortDir || 'ASC',
        page: this.props.page || 0,
        limit: this.props.limit || 50,
        keywords:{}
      };
    } else {
      this.setting = JSON.parse(setting);
    }
    var lov = {};
    this.props.fields.forEach(function(fld) {
      if (fld.type=='lov' && fld.list && fld.list.length > 0) {
        lov[fld.name] = fld.list;
      }
    });
    return {
      data: this.props.data || [],
      sortBy: this.setting.sortBy,
      sortDir: this.setting.sortDir,
      page: this.setting.page,
      limit: this.setting.limit,
      displayRows: this.props.displayRows || 10,
      totalRows: 0,
      checkedAll:false,
      checked:{},
      isLoading:false,
      keywords:this.setting.keywords,
      lov:lov
    }
  },

  componentDidMount: function() {
    if (this.props.listAction) {
      this.onListUnsubscribe = this.props.listAction.done.listen(this.onListDone);
    } else if (this.props.actions && this.props.actions.list){
      this.onListUnsubscribe = this.props.actions.list.done.listen(this.onListDone);
    }

    if (this.props.exportAction) {
      this.onExportUnsubscribe = this.props.exportAction.done.listen(this.onExportDone);
    } else if (this.props.actions && this.props.actions.export) {
      this.onExportUnsubscribe = this.props.actions.export.done.listen(this.onExportDone);
    }

    if (this.props.facetAction) {
      this.onFacetListUnsubscribe = this.props.facetAction.done.listen(this.onFacetListDone);
      this.props.facetAction();
    } else if (this.props.actions && this.props.actions.facetList) {
      this.onFacetListUnsubscribe = this.props.actions.facetList.done.listen(this.onFacetListDone);
      this.props.actions.facetList();
    }

    this.doRefresh();
  },

  componentWillUnmount: function() {
    if (this.onListUnsubscribe) {
      this.onListUnsubscribe();
    }
    if (this.onExportUnsubscribe) {
      this.onExportUnsubscribe();
    }
    if (this.onFacetListUnsubscribe) {
      this.onFacetListUnsubscribe();
    }
  },

  doRefresh: function() {
    this.setState({
      isLoading:true
    }, function() {
      var keyword = {};
      for(var i in this.state.keywords) {
        if (typeof this.state.keywords[i].format === 'function') {
          keyword[i] = this.state.keywords[i].format('YYYY-MM-DD');
        } else {
          keyword[i] = this.state.keywords[i];
        }
      }
//      console.log('filters', this.props.filters);
      if (this.props.filters) {
        for (var i in this.props.filters) {
          if (this.props.filters[i]===null || this.props.filters[i]===false) {
            continue;
          }
          keyword[i] = this.props.filters[i];
        }
//        console.log(keyword);
      }
      // save cookie
      this.setting =  {
        sortBy: this.state.sortBy,
        sortDir: this.state.sortDir,
        page: this.state.page,
        limit: this.state.limit,
        keywords: keyword
      };
      console.log('cookie=', this.cookieName,  JSON.stringify(this.setting));
      helper.setCookie(this.cookieName, JSON.stringify(this.setting));

      if (this.props.listAction) {
        this.props.listAction(this.setting);
      } else if (this.props.actions && this.props.actions.list) {
        this.props.actions.list(this.setting);
      }
    }.bind(this));
  },

  onListDone: function(data, opt) {
    this.setState({
      data: data,
      sortBy: opt.sortBy,
      sortDir: opt.sortDir,
      page: opt.page,
      limit: opt.limit,
      totalRows: opt.totalRows,
      isLoading:false
    }, function() {
      if (this.refs.firstrow) {
        this.refs.firstrow.getDOMNode().scrollIntoView();
      }
      console.log(this.state.keywords);
//      console.log(this.refs.firstrow);
    });
  },

  onExportDone: function(file) {
    window.open(file, '_blank');
  },

  onListError: function(msg) {
    console.log('ERROR:', msg);
    this.setState({
      isLoading:false
    });
  },

  onFacetListDone: function(data) {
    // merge
    for (var i in data) {
      if (data.hasOwnProperty(i)) {
        this.state.lov[i] = data[i];
      }
    };
    this.setState({
       lov: data
    });
  },

  updateKeyword: function(id, value, search) {
    this.state.keywords[id] = value;
    this.setState({
      keywords:this.state.keywords
    }, function() {
      if (search===true) {
        this.doSearch();
      }
    }.bind(this));
  },

  toggleClick: function(id, e) {
    this.state.checked[id] = !this.state.checked[id];

    // count
    var numChk = 0;
    for(var i in this.state.checked) {
      numChk += this.state.checked[i]===true ? 1 : 0;
    }

    this.setState({
      checked: this.state.checked,
      checkedAll: numChk===this.state.data.length
    });
  },

  toggleSelected: function(id, e) {
    if (this.props.checkbox===true) {
      return;
    }
    // unselected all
    for(var i in this.state.checked) {
      this.state.checked[i]=false;
    }
    this.state.checked[id] = !this.state.checked[id];
    this.setState({
      checked: this.state.checked
    });
  },

  toggleAll: function() {
    this.state.checkedAll = !this.state.checkedAll;
    this.state.data.forEach(function(row) {
      this.state.checked[row[this.props.pk]] = this.state.checkedAll;
    }.bind(this));
    this.setState({
      checked: this.state.checked,
      checkedAll: this.state.checkedAll
    });
  },

  toggleSort: function(field) {
    if (field.type=='actions' || field.sort===false) {
      return;
    }
    if (field.name != this.state.sortBy) {
      this.setting = {
        sortBy: field.name,
        sortDir: 'ASC',
        page: 0,
        limit: this.state.limit,
        keywords: this.state.keywords
      };
    } else {
      this.setting = {
        sortBy: field.name,
        sortDir: this.state.sortDir=='ASC' ? 'DESC' : 'ASC',
        page: 0,
        limit: this.state.limit,
        keywords: this.state.keywords
      }
    }

    helper.setCookie(this.cookieName, JSON.stringify(this.setting));
    if (this.props.listAction) {
      this.props.listAction(this.setting);
    } else if (this.props.actions && this.props.actions.list) {
      this.props.actions.list(this.setting);
    }

    this.setState({
      isLoading:true
    });
  },

  doSearch: function(e) {
    if (e) {
      e.preventDefault();
    }
    this.state.page = 0;
    this.doRefresh();
  },

  clearSearch: function(e) {
    if (e) {
      e.preventDefault();
    }
    this.state.keywords = {};
    this.state.page = 0;
    this.doRefresh();
  },

  pageChange: function(e) {
    this.state.page = e.target.value;
    this.doRefresh();
  },

  limitChange: function(e) {
    this.state.limit = e.target.value;
    this.state.page = 0;
    this.doRefresh();
  },

  exportExcel: function() {
    var keyword = {};

    for(var i in this.state.keywords) {
      if (typeof this.state.keywords[i].format === 'function') {
        keyword[i] = this.state.keywords[i].format('YYYY-MM-DD');
      } else {
        keyword[i] = this.state.keywords[i];
      }
    }

    if (this.props.filters) {
      for (var i in this.props.filters) {
        if (this.props.filters[i]===null || this.props.filters[i]===false) {
          continue;
        }
        keyword[i] = this.props.filters[i];
      }
    }

    if (this.props.exportAction) {
      this.props.exportAction({
        sortBy: this.state.sortBy,
        sortDir: this.state.sortDir,
        keywords: keyword
      });
    } else if (this.props.actions && this.props.actions.export) {
      this.props.actions.export({
        sortBy: this.state.sortBy,
        sortDir: this.state.sortDir,
        keywords: keyword
      });
    }
  },

  render: function() {
    var colgroup = this.props.fields.map(function(field) {
      return (
        <col key={field.name} style={{width:field.width||null}}></col>
      );
    });

    var thead = this.props.fields.map(function(field) {
      var width = null;
      if (field.width) {
        width = (parseInt(field.width)-8)+'px';
      }
      var cmd = null;
      if (field.type=='actions' && (this.props.exportAction || (this.props.actions && this.props.actions.export))) {
        cmd = (
          <div className="flex">
            <span className="flaticon-download164" title={tr.translate('action.exportToExcel')} onClick={this.exportExcel}></span>
          </div>
        )
      }
      return (
        <th
          key={field.name}
          className={'' + (this.state.sortBy==field.name ? 'sorted' : '')}
          onClick={field.sort===false ? null : function(e) {
            this.toggleSort(field, e)
          }.bind(this)}
          style={{width:width}}
          >
          {cmd || (
            <div className="flex">
              {field.title ? (<T
                key={field.name}
                content={field.title}
                component="div"
                className="text"
                title={tr.translate(field.hint || field.title)}
              />) : null}
              {field.sort===false ? null : <div className={'flaticon-'+(this.state.sortDir=='DESC'?'expand38':'expand39')+' sort-icon'}></div>}
            </div>
          )}
      </th>
      );
    }.bind(this));



    var list = this.state.data.map(function(row, row_i) {
      var list2 = this.props.fields.map(function(field) {
        var cn= [];
        if (this.state.sortBy==field.name) {
          cn.push('sorted');
        }
        if (typeof field.className == 'string') {
          cn.push(field.className);
        }
        var content = null;
        if (typeof field.render==='function') {
          content = field.render(row);
        } else if(field.format==='money') {
          content = helper.numberFormat(row[field.name],2);
          cn.push('right');
        } else {
          content = row[field.name];
        }
        return (
          <td
            key={field.name}
            className={cn.join(' ')}
            >
            {content}
          </td>
        );
      }.bind(this));

      var chk = (
        <td><span
          className={'flaticon-'+(this.state.checked[row[this.props.pk]]===true?'black399':'blank31')+' chk flex'}
          onClick={function(e) {this.toggleClick(row[this.props.pk], e)}.bind(this)}
          ></span></td>
      );

      return (
        <tr key={row[this.props.pk]} ref={row_i==0?'firstrow':null} className={this.state.checked[row[this.props.pk]]?'selected':''} onClick={function(e){this.toggleSelected(row.id, e)}.bind(this)}>
          {this.props.checkbox ? chk : null}
          {list2}
        </tr>
      );
    }.bind(this));

    var numRows = this.props.displayRows || this.props.limit;
    var totalPages = Math.ceil(this.state.totalRows / this.state.limit);
    var pageList = [];
    for (var i = 0; i < totalPages; i++) {
      pageList.push(
        <option key={i} value={i}>{i+1}</option>
      );
    }
    var rowFrom = (this.state.page * this.state.limit)+1;
    var rowTo = Math.min((this.state.page+1) * this.state.limit, this.state.totalRows);
    var limitList = [10,50,100,200].map(function(item) {
      return (<option key={item} value={item}>{item}</option>);
    });
    var widthStyle = null;
    if (this.props.width) {
      widthStyle = {width:this.props.width};
    }
    return (
      <div className="flex-grid">
        <div>
          <div style={widthStyle}>
            <div className="header">
              <table>
                <colgroup>
                  {this.props.checkbox ? (<col style={{width:'32px',maxWidth:'32px'}}></col>): null}
                  {colgroup}
                </colgroup>
                <thead>
                  <tr>
                    {this.props.checkbox ? (
                      <th className="flex"><span className={'flaticon-'+(this.state.checkedAll?'black399':'blank31')+' chk'} onClick={this.toggleAll}></span></th>) : null}
                    {thead}
                  </tr>
                  <SearchRow search={this.props.search} fields={this.props.fields} keywords={this.state.keywords}/>
                </thead>
              </table>
            </div>
            <div className={'body'+(this.state.isLoading?' loading':'')} style={{height:(32*numRows)+'px'}}>
              <div className="load-status">Loading...</div>
              <table>
                <colgroup>
                  {this.props.checkbox ? (<col style={{width:'32px',maxWidth:'32px'}}></col>): null}
                  {colgroup}
                </colgroup>
                <tbody>
                  {list}
                </tbody>
              </table>
            </div>
            <div className="footer">
              <table>
                <tfoot>
                  <tr>
                    <td className="flex">
                      <div className="pageNumber no-shrink">
                        <T content="page.pageNumber"/> <select value={this.state.page} onChange={this.pageChange}>{pageList}</select>
                        / {totalPages}
                      </div>
                      <div className="rowNumber no-shrink">
                        <T content="page.rowNumber"/> ({rowFrom}-{rowTo} / {this.state.totalRows})
                      </div>
                      <div className="perPage no-shrink">
                        <T content="page.perPage"/> <select value={this.state.limit} onChange={this.limitChange}>{limitList}</select> <T content="page.rows"/>
                      </div>
                      <div className="can-grow">
                        {this.props.footer}
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = FlexGrid;
