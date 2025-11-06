import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useApp";
import { registerDeviceUser, fetchDevices } from "../store/deviceSlice";
import { fetchAllUsers } from "../store/userSlice";

const DeviceUserRegister: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const device = (location.state as any)?.device || {};
  const users = useAppSelector((state: any) => state.user.list);

  const [userid, setUserid] = useState("");
  const [startDate, setStartDate] = useState("");

  // 페이지 진입 시 유저 목록 조회
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleRegister = async () => {
    if (!device.serialNumber) {
      alert("장치 정보가 없습니다.");
      navigate("/devices");
      return;
    }

    try {
      await dispatch(
        registerDeviceUser({
          serialNumber: device.serialNumber,
          category: device.catName,
          userid,
          startDate,
        })
      ).unwrap();

      alert("등록 완료!");
      dispatch(fetchDevices());
      navigate("/devices");
    } catch (err: any) {
      alert("장치 사용자 등록 실패");
    }
  };

  const handleCancel = () => {
    navigate("/devices");
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>장치 사용자 등록</h2>

      <div style={{ maxWidth: 600 }}>
        <div>
          <label>일련번호</label>
          <input value={device.serialNumber} disabled className="w-full border" />
        </div>
        <div>
          <label>장치분류</label>
          <input value={device.catName} disabled className="w-full border" />
        </div>
        <div>
          <label className="block mb-1">장치 사용자</label>
          <select
            value={userid}
            onChange={(e)=> setUserid(e.target.value)}
          >
            <option value="">선택하세요</option>
            {users.map((u:any) => (
              <option key={u.userid} value={u.userid}>{u.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>사용 시작일</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border"
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleRegister}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            등록
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceUserRegister;
