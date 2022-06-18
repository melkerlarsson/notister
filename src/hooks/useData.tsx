import { useEffect, useState } from "react";

type UseDataProps<T> = {
	loadData: () => Promise<T>;
};

const useData = <T,>({ loadData }: UseDataProps<T>) => {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<string | null>(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			setData(await loadData());
			setLoading(false);
		} catch (error) {
			setError("Error loading data");
		}
	};

	const reload = () => fetchData();

	useEffect(() => {
		void fetchData();
	}, []);

	return { data, loading, reload, error, setData };
};

export default useData;
