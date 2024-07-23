import { Reactor } from "@/src/data/type/reacter";

const datas: Reactor[] = require("@/src/data/json/reactor.json");

export default function ReactorLayoutPage() {

  return (
    <div className="max-w-4xl m-auto p-4">
      <div className="mt-8 ml-6 text-2xl font-bold">반응로 정보</div>
      <div className="flex items-center mt-6 ml-6 text-center">
        <div className="w-40">반응로</div>
        <div className="w-28">등급</div>
        <div className="w-40">최적화 조건</div>
        <div className="w-44">스킬 위력 증가율 1</div>
        <div className="w-44">스킬 위력 증가율 2</div>
      </div>
      
        {
          datas.filter((data, idx) => {
            return (
              datas.findIndex((data1) => {
                return data.reactor_name === data1.reactor_name
              }) === idx
            )
          }).map((data, idx) => {
            return (
              <div className="flex mt-6 ml-6 items-center">
                <div className="flex flex-col items-center w-40">
                  <img className="h-20 w-20 object-cover" src={data.image_url} />
                  <div>{data.reactor_name}</div>
                </div>
                <div className="w-28 text-center">
                  {["반응로", "냉기 반응로", "화염 반응로", "전기 반응로", "독성 반응로"].includes(data.reactor_name)
                  ? data.reactor_tier : "일반~궁극"
                  } 등급
                </div>
                <div className="w-40 text-center">
                {["반응로", "냉기 반응로", "화염 반응로", "전기 반응로", "독성 반응로"].includes(data.reactor_name)
                  ? data.optimized_condition_type : <span>전체 무기군 랜덤<br />(등급에 따라)</span>
                }
                </div>
                <div className="w-44 text-center">
                 {
                  data.reactor_skill_power[0].skill_power_coefficient.length === 0 ?
                  "없음" : data.reactor_skill_power[0].skill_power_coefficient[0].coefficient_stat_id
                 }
                </div> 
                <div className="w-44 text-center">
                 {
                  data.reactor_skill_power[0].skill_power_coefficient.length === 0 ?
                  "없음" : data.reactor_skill_power[0].skill_power_coefficient[1].coefficient_stat_id
                 }
                </div> 
              </div>
            )
          })
        }
      </div>

  )
}
