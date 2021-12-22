import request, { gql } from "graphql-request";

export async function deleteAction(Action, mutate, callBack, batch) {
	let MUTATION_QUERY = "";
	if (
		batch ||
		window.confirm(`Deseja realmente deletar a ação "${Action.name}?"`)
	) {
		MUTATION_QUERY = gql`mutation{
        deleteAction(where:{id:"${Action.id}"}){
          id
        }
      }`;
	} else {
		return false;
	}
	//Atualiza a UI OPTIMISTIC
	mutate((data) => {
		const actions = data.actions.filter((action) => action.id != Action.id);
		return { ...data, actions };
	}, false);

	if (callBack) {
		callBack();
	}

	const result = await fetcher(MUTATION_QUERY);

	mutate();

	return result;
}

async function fetcher(QUERY) {
	const result = await request(
		"https://api-us-east-1.graphcms.com/v2/ckursm70w0eq101y2982b3c14/master",
		QUERY
	);
	return result;
}
