<template lang="html">
  <!--    考试界面-->
  <div class="flex-container">
    <!--    ---------------------------------------- 左侧部分 --------------------------------------------  -->
    <div v-cloak class="container-left">
      <div class="user-info">
<!--        <pre-exam-user-info/>--> 123
      </div>

      <div v-cloak class="exam-info">
<!--        <pre-exam-exam-info/>--> 456
      </div>
    </div>
    <!--    ---------------------------------------- 左侧部分 --------------------------------------------  -->

    <!--    ---------------------------------------- 右侧部分 --------------------------------------------  -->
<!--    <div class="container-right">
      <div v-cloak class="bg-gray-100 h-full  flex flex-col justify-center items-center py-10">
        <div class="w-11/12 bg-white p-12 rounded-lg shadow-md w-full overflow-auto">
          <h1 class="text-2xl font-bold mb-4 text-center">考试须知</h1>
          <div class="mb-4">
            <LazyVH5 marker aligned>考试规则：</LazyVH5>
            <ol class="list-decimal list-inside">
              <li>请在考试开始前查看并确认电脑和键盘是否正常。</li>
              <li>请遵守考试平台规定的操作步骤和流程。</li>
              <li>不得在考试期间使用任何未经授权的软件或工具。</li>
              <li>禁止查阅、复制或使用任何未经授权的资料。</li>
              <li>请保持考试期间安静，不要交谈或干扰其他考生。</li>
              <li>在考试开始后，请不要离开座位，除非获准。</li>
              <li>禁止使用任何通讯设备，包括手机、平板电脑等。</li>
            </ol>
          </div>
          <div class="mb-4">
            <LazyVH5 marker aligned>注意事项：</LazyVH5>
            <ol class="list-decimal list-inside">
              <li>在考试期间，如果遇到任何技术问题，请立即向监考人员报告。</li>
              <li>确保电脑电量充足，并且备有充电器。</li>
              <li>在考试过程中，保持专注，不要被周围的环境干扰。</li>
              <li>如有需要，可以提前熟悉考试平台的操作界面。</li>
              <li>仔细阅读试题和答题要求，按照要求答题。</li>
              <li>注意考试时间，合理安排时间完成试卷。</li>
              <li>如有任何问题，请举手向监考人员求助。</li>
              <li>在考试过程中保持冷静，不要因为紧张而影响发挥。</li>
              <li>遵守考试纪律，不得有作弊行为。</li>
            </ol>
          </div>
          <div class="mb-4">
            <LazyVH5 marker aligned>其他信息：</LazyVH5>
            <p>如有特殊情况需要申请考试延期或其他特殊安排，请提前与相关部门联系。</p>
            <p>考试期间如遇突发事件或其他紧急情况，按照监考人员的指示行动。</p>
          </div>
          <div class="mb-4">
            <LazyVH5 marker aligned>重要提示：</LazyVH5>
            <p>违反考试规则者将受到相应处罚，包括但不限于取消考试资格、作弊记过等。</p>
            <p>请遵守考试规定，共同维护公平的考试环境。</p>
          </div>
        </div>
      </div>
    </div>-->
    <!--    ---------------------------------------- 右侧部分 --------------------------------------------  -->
  </div>

</template>

<script setup lang="ts">
</script>

<style>
.flex-container {
  display: flex;
  flex-direction: row;
}

.container-left {
  width: 340px;
  margin: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
  height: 90vh;
}

.container-right {
  flex: auto;
  margin: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
  height: 90vh;

}

</style>