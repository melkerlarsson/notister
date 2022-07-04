import { ReviewDifficulty } from "../types/review";

export const newDateDaysInFuture = (days: number) => {
	const date = new Date(Date.now());
	date.setHours(0, 0, 0, 0);
	date.setDate(date.getDate() + days);
	return date;
};

export const calculateNewReviewInterval = (lastInterval: number, difficulty: ReviewDifficulty): number => {
	if (lastInterval === 0) {
		lastInterval = 1;
	}

	switch (difficulty) {
		case ReviewDifficulty.Impossible:
			return 0;
		case ReviewDifficulty.Difficult:
			return lastInterval + 3;
		case ReviewDifficulty.Okay:
			return lastInterval + 7;
		case ReviewDifficulty.Easy:
			return lastInterval + 14;
	}
};

export const isFolderItemNote = (item: Note | SubFolder): item is Note => {
	return (<Note>item).imageUrl !== undefined;
};