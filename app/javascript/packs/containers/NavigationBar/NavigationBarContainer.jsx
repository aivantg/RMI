import React from 'react';

import {loadInitialState} from '../../actions/initialState';
import {getBuildings, getBuildingById} from '../../selectors/buildingsSelector';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DropdownMenuContainer from './DropdownMenuContainer'
import {getName, getEmail} from '../../selectors/usersSelector'
import {getCurrentCategory, getCategories, getFirstUnansweredCategory} from "../../selectors/categoriesSelector";
import CategoryContainer from './CategoryContainer';
import {getQuestionsByBuilding, getQuestionsByCategory} from "../../selectors/questionsSelector";
import {getRemainingAnswersforCategory} from "../../selectors/answersSelector";


class NavigationBarContainer extends React.Component {

  render() {
    const username = this.props.username;
    const userEmail = this.props.userEmail;
    return (
      <div>
        <DropdownMenuContainer
          buildings={this.props.buildings}
          currentBuilding={this.props.currentBuilding}
          history={this.props.history}>
        </DropdownMenuContainer>

        <CategoryContainer
          categories={this.props.categories}
          currentCategory={this.props.currentCategory}
          currentBuilding={this.props.currentBuilding}
          remainingQuestions={this.props.remainingQuestions}>
        </CategoryContainer>

        <div
          className="userInfo">
          {username} <br/>
          {userEmail}
        </div>
      </div>
    )

  }
}

function mapStateToProps(state, ownProps) {
  const buildingView = ownProps.match.params.entity == "buildings";
  const questions = buildingView && ownProps.match.params.id ?
    getQuestionsByBuilding(ownProps.match.params.id, state) : [];
  const categoryId = ownProps.match.params.cId ? ownProps.match.params.cId : null;
  const questionsByCategory = getQuestionsByCategory(categoryId, questions);

  let remainingQuestions;
  if (!ownProps.match.params.id) {
    remainingQuestions = null;
  } else if (!questionsByCategory) {
    remainingQuestions = 0;
  } else {
    remainingQuestions = getRemainingAnswersforCategory(questionsByCategory, ownProps.match.params.id, state);
  }

  let loadCategory;
  if (!buildingView) {
    loadCategory = null;
  }
  else if (!ownProps.match.params.cId) {
    // need category ids
    //need questions by their categories
    let categories = getCategories(ownProps.match.params.id, state);
    loadCategory = getFirstUnansweredCategory(categories, questions, ownProps.match.params.id, state);
  } else {
    getCurrentCategory(ownProps.match.params.cId, state)
  }
  return {
    buildings: getBuildings(state),

    currentBuilding: buildingView && ownProps.match.params.id ?
      getBuildingById(ownProps.match.params.id, state) : null,

    userEmail: getEmail(state),

    username: getName(state),

    currentCategory: loadCategory,

    categories: buildingView ?
      getCategories(ownProps.match.params.id, state) : {},

    remainingQuestions: remainingQuestions,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initActions: bindActionCreators({loadInitialState}, dispatch)
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationBarContainer);
