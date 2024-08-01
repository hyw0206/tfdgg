import { useEffect, useState } from 'react'
import { Flex, Progress, Select, Space, Tooltip } from 'antd'
import { StatInfo } from '@/src/data/type/statinfo'
import { Weapon, Basestat } from '@/src/data/type/weapon_type'
import { Stat } from '@/src/data/type/stat'
import { Module } from '@/src/data/type/module'

export default function WeaponStatDetailPage(props: { weaponNumber: string }) {
  const wantStats = [
    '발사 속도',
    '약점 배율',
    '거리별 공격력 감소비율',
    '최대사거리',
    '장탄량',
    '재장전 시간',
    '이동 속도',
    '관통',
    '총기 치명타 확률',
    '총기 치명타 배율',
    '관통력',
    '속성 상태효과 부여확률',
  ]

  // 무기 데이터
  const [datas, setDatas] = useState<Weapon[]>([])
  // 스텟 데이터
  const [stats, setStats] = useState<Stat[]>([])
  // 스텟 평균값 데이터
  const [statInfo, setStatInfo] = useState<StatInfo>()
  const [moduleInfo, setModuleInfo] = useState<Module[]>([]);
  
  // 내가 볼 무기 레벨 데이터
  const [level, setLevel] = useState('160')
  // 데이터 불러오기 전 까지는 로딩중 띄우기
  const [isLoading, setIsLoading] = useState(true)

  // 필터링 상태
  const [tierFilter, setTierFilter] = useState<string | null>(null);
  const [socketTypeFilter, setSocketTypeFilter] = useState<string | null>(null);

  // 1~160레벨 세팅
  const levelOptions = Array.from({ length: 160 }, (_, i) => ({
    value: `${i + 1}`,
    label: `LV.${i + 1}`,
  }))

  // 다른 레벨의 정보를 보고 싶을 때
  const onChangeGetLevel = (selectLevel: string) => {
    if (level === selectLevel) return;
    setLevel(selectLevel)
  }

  // 내가 볼 무기 순서
  const weaponNumber = Number(props.weaponNumber);

  // 일부 스탯 값 픽스
  const changeStatValue = (stat: Basestat): string => {
    if (['약점 배율', '총기 치명타 배율'].includes(getStatName(stat.stat_id)))
      return stat.stat_value + 'x'
    if (
      ['총기 치명타 확률', '속성 상태효과 부여확률'].includes(
        getStatName(stat.stat_id),
      )
    )
      return stat.stat_value + '%'
    if (['재장전 시간'].includes(getStatName(stat.stat_id)))
      return Number(stat.stat_value).toFixed(2)
    return String(stat.stat_value)
  }

  useEffect(() => {
    // 데이터를 불러오고, 준비가 된다면 보여주기
    const fetchData = async () => {
      const weaponData = await import('@/src/data/json/weapon.json')
      const statData = await import('@/src/data/json/stat.json')
      const statInfoData = await import('@/src/data/json/statInfo.json')
      const moduleInfoData = await import('@/src/data/json/module.json')
      setDatas(weaponData.default)
      setStats(statData.default)
      setStatInfo(statInfoData.default)
      setModuleInfo(moduleInfoData.default)
      setLevel('160')
      setIsLoading(false)
    }
    fetchData()
  }, [])

  // id 형태인 스탯을 이름으로 바꿔줌
  const getStatName = (id: string): string => {
    const result = stats?.find((stat) => stat.stat_id === id)
    return result ? result.stat_name : 'error'
  }

  const calculatePercentageOfStat = (value: number, statName: string) => {
    // statInfo가 undefined일 경우, 기본값 처리
    if (!statInfo) return 0;
  
    // statInfo가 string 인덱스 시그니처를 갖도록 강제함
    const { min, max } = (statInfo as unknown as Record<string, { min: number; max: number }>)?.[statName] || { min: 0, max: 100 };
    
  // value를 number로 처리
    let percent = (value / max) * 100;
    percent = Math.min(Math.max(percent, 2), 100); // Ensure percent is between 2 and 100
    return Math.round(percent); // Return rounded percentage
  };

  // 로딩 중 처리
  if (isLoading) {
    return <div>최초 무기 정보 로딩중..</div>
  }

  // 모듈 필터링
  const filteredModules = moduleInfo.filter(module => {
    const isTierMatch = tierFilter ? module.module_tier === tierFilter : true;
    const isSocketTypeMatch = socketTypeFilter ? module.module_socket_type === socketTypeFilter : true;
    return isTierMatch && isSocketTypeMatch;
  });

  // 필터 옵션
  const tierOptions = ['일반', '희귀', '궁극', '전체'];
  const socketTypeOptions = ['말라카이트', '크산틱', '루틸', '알만딘', '세룰리안', '일반', '전체'];

  return (
    <>
      <div className="mb-4 text-xl">
        <strong>{datas[weaponNumber].weapon_name}</strong> 정보
      </div>
      <div className="flex flex-col">
        <div className="flex">
          <div className="h-16 w-36 mr-4">
            <img
              className="h-14 w-36 p-1 object-cover weapon"
              src={datas[weaponNumber].image_url}
            />
          </div>
          <div className="flex flex-col">
            <div className="font-bold">{datas[weaponNumber].weapon_name}</div>
            <div className="text-sm opacity-75">
              {datas[weaponNumber].weapon_type} |{' '}
              {datas[weaponNumber].weapon_rounds_type} |{' '}
              {datas[weaponNumber].weapon_tier} 등급
            </div>
          </div>
        </div>
        <Space wrap>
          <Select
            value={`LV.${level}`}
            style={{ width: 120, marginBottom: 8 }}
            options={levelOptions}
            onChange={onChangeGetLevel}
          />
        </Space>
        <div className="flex flex-row">
          <div className="w-48 mr-4 text-lg text-right">
            {getStatName(
              datas[weaponNumber].firearm_atk[Number(level) - 1].firearm[0]
                .firearm_atk_type,
            )}
          </div>
          <Flex style={{ width: 200 }}>
            <Progress
              percent={parseInt(
                (
                  (datas[weaponNumber].firearm_atk[Number(level) - 1].firearm[0]
                    .firearm_atk_value /
                    datas[weaponNumber].firearm_atk[159].firearm[0]
                      .firearm_atk_value) *
                  100
                ).toFixed(0),
              )}
              showInfo={false}
              size="small"
            />
          </Flex>
          <div className="ml-4 text-lg">
            {
              datas[weaponNumber].firearm_atk[Number(level) - 1].firearm[0]
                .firearm_atk_value
            }
          </div>
        </div>
        <div>{}</div>
        <div className="flex flex-col">
          {datas[weaponNumber].base_stat
            .filter((stat) => wantStats.includes(getStatName(stat.stat_id)))
            .map((stat, index) => (
              <div className="flex flex-row" key={index}>
                <div className="w-48 mr-4 text-lg text-right">
                  {getStatName(stat.stat_id)}
                </div>
                <Flex style={{ width: 200 }}>
                  <Progress
                    percent={calculatePercentageOfStat(
                      Number(stat.stat_value),
                      getStatName(stat.stat_id),
                    )}
                    showInfo={false}
                    size="small"
                  />
                </Flex>
                <div className="ml-4 text-lg">{changeStatValue(stat)}</div>
              </div>
            ))}
        </div>
      </div>
      <div className="mt-4 mb-4 text-xl">
        <strong>{datas[weaponNumber].weapon_name}</strong> 특성
      </div>
      <div>
        {
          datas[weaponNumber].weapon_perk_ability_image_url !== null ?
          <>
            <img className="w-16 mt-4 skill" src={datas[weaponNumber]?.weapon_perk_ability_image_url}></img>
            <div className="mt-4 text-2xl font-bold text-gray-500">
              {datas[weaponNumber].weapon_perk_ability_name}
            </div>  
            <div className="mt-2">
              {datas[weaponNumber].weapon_perk_ability_description}
            </div> 
          </>
        : 
        <div>
          특성 없음
        </div>
        }
      </div>
      <div className="mt-4 mb-4 text-xl font-bold">
        장착 가능한 모듈 (마우스 올릴 시 자세한 설명)
      </div>
      <div className="flex flex-col mb-4">
        <div className="flex mb-4">
          <Select
            style={{ width: 120, marginRight: 8 }}
            placeholder="등급 필터"
            value={tierFilter || '전체'}
            onChange={setTierFilter}
          >
            {tierOptions.map(tier => (
              <Select.Option key={tier} value={tier === '전체' ? null : tier}>{tier}</Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 180 }}
            placeholder="소켓 타입 필터"
            value={socketTypeFilter || '전체'}
            onChange={setSocketTypeFilter}
          >
            {socketTypeOptions.map(socketType => (
              <Select.Option key={socketType} value={socketType === '전체' ? null : socketType}>{socketType}</Select.Option>
            ))}
          </Select>
        </div>
        <div className="flex flex-wrap">
          {filteredModules.filter(module =>
            module.module_class === datas[weaponNumber].weapon_rounds_type
          ).map((module, idx) => (
            <Tooltip title={
              <div className="flex flex-col w-60 p-2">
                <div className="flex flex-row items-center justify-between pb-2 border-b font-bold">
                  <div className="text-lg">{module.module_name}</div>
                  <div>{module.module_tier}</div>
                </div>
                <div className="flex flex-row pt-2 pb-2">
                  <div><img className="w-20" src={module.image_url} /></div>
                  <div className="ml-4">
                    <div>수용량</div>
                    <div>{module.module_stat[0].module_capacity}~{module.module_stat[module.module_stat.length-1].module_capacity}</div>
                  </div>
                </div>
                <div className="flex flex-row pt-1 pb-1 border-y border-gray text-center font-bold">
                  <div className="basis-1/2 border-r">
                    <div>모듈 소켓 타입</div>
                    <div>{module.module_socket_type}</div>
                  </div>
                  <div className="basis-1/2">
                    <div>모듈 클래스</div>
                    <div>{module.module_class}</div> 
                  </div>
                </div>
                <div className="flex flex-col pt-2 pb-2 border-b border-gray">
                  <div className="font-bold">최저 레벨 효과</div>
                  <div>{module.module_stat[0].value}</div>
                </div>
                <div className="flex flex-col pt-2 pb-2 border-b border-gray">
                  <div className="font-bold">최고 레벨 효과</div>
                  <div>{module.module_stat[module.module_stat.length-1].value}</div>
                </div>
              </div>
            } key={idx}>
              <div className="w-28 flex flex-col pb-2 cursor-pointer">
                <img className="w-16 m-auto skill" src={module.image_url} />
                <div className="text-center text-sm">{module.module_name}</div>
                <div className="text-center text-sm">{module.module_tier} / {module.module_socket_type}</div>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </>
  )
}
