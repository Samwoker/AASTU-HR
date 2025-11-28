import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDepartments } from './slice';
import { selectDepartments, selectDepartmentsLoading } from './slice/selectors';
import AdminLayout from '../../../components/DefaultLayout/AdminLayout';

export default function Departments() {
  const { actions } = useDepartments();
  const dispatch = useDispatch();
  const departments = useSelector(selectDepartments);
  const isLoading = useSelector(selectDepartmentsLoading);

  useEffect(() => {
    dispatch(actions.fetchDepartmentsStart());
  }, [dispatch, actions]);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Departments</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul className="bg-white rounded shadow p-4">
            {departments.map((dept) => (
              <li key={dept.id} className="border-b last:border-b-0 py-2">
                {dept.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminLayout>
  );
}
