import chalk from "chalk";

const youShouldNeverUseVar =
	"This is my very long line that eslint should check as an error ...........................................";

function myFunction(used) {
	if (used) {
		console.log(used);
		return;
	}
	return null;
}

export default youShouldNeverUseVar;
