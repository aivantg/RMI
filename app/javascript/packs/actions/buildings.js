import {
  ADD_BUILDING,
  EDIT_BUILDING,
  REMOVE_BUILDING,
  CREATE_BUILDING,
  UPDATE_BUILDING,
  ASSIGN_BUILDING_OPERATOR,
  UNASSIGN_BUILDING_OPERATOR,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  FETCH_IN_PROGRESS,
  FETCH_SETTINGS,
  FETCH_ANSWER,
  ADD_ANSWER,
  CREATE_ANSWER,
  UPDATE_ANSWER,
  REMOVE_ANSWER,
  SAVE_ANSWER,
} from '../constants';

export function addBuilding(portfolioId) {
  return {
    type: ADD_BUILDING,
    portfolioId
  };
}

export function editBuilding(id, updatedBuilding) {
  return {
    type: EDIT_BUILDING,
    building: updatedBuilding,
    buildingId: id
  };
}

export function removeBuilding(id, dispatch) {
  return {
    type: REMOVE_BUILDING,
    buildingId: id
  };
}

function saveBuilding(type, id, response) {
  return {
    type,
    status: FETCH_SUCCESS,
    buildingId: id,
    response
  };
}

function saveBuildingError(type, id, error) {
  return {
    ...saveError(type, error),
    buildingId: id,
  };
}

export async function createBuilding(id, building, dispatch) {
  dispatch({
    type: CREATE_BUILDING,
    status: FETCH_IN_PROGRESS,
    buildingId: id
  });

  try {
    const buildingData = JSON.stringify({
      ...building,
      portfolio_id: building.portfolioId
    });

    let response = await fetch(`/api/buildings/`, {
      method: 'POST',
      data: buildingData,
      ...FETCH_SETTINGS
    }).then(resp => resp.json());

    dispatch(removeBuilding(id, dispatch));

    let id = response.data.id;
    dispatch(saveBuilding(CREATE_BUILDING, id, response.data));
  } catch (error) {
    dispatch(saveBuildingError(CREATE_BUILDING, id, error));
  };
}

export async function updateBuilding(id, updatedBuilding, dispatch) {  
  dispatch({
    type: UPDATE_BUILDING,
    status: FETCH_IN_PROGRESS,
    buildingId: id
  });

  try {
    const buildingData = JSON.stringify({
      ...updatedBuilding,
      portfolio_id: updatedBuilding.portfolioId
    });

    let response = await fetch(`/api/buildings/${id}`, {
      method: 'PUT',
      data: buildingData,
      ...FETCH_SETTINGS
    }).then(resp => resp.json());

    dispatch(saveBuilding(UPDATE_BUILDING, id, response.data));
  } catch (error) {
    dispatch(saveError(UPDATE_BUILDING, id, error));
  };
}

