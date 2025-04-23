import React, { useEffect, useState } from 'react';
import { useActivity } from '../../services/activity/activityService';
import { useMember } from '../../services/member/memberService';
import { useAlert } from '../../services/alert/alertService';
import { formatCurrency } from '../../utils/stringUtils';
import { StreaksCategory } from '../../enums/streaks-category';
import { StreakPolicy } from '../../models/streak-policy';
import { StreakProgressSelections } from '../../models/streak-progress-selections';
import { Member } from '../../models/member';
import { ColorScheme } from '../../constants/color-scheme';
import { GeneralConstants } from 'constants/general-constants';
import { CouponEnum } from 'enums/coupon-enum';
import { AppTimer } from '../AppTimer/AppTimer';
import { RootState } from 'store';
import { useSelector, useDispatch } from 'react-redux';
import { addMember } from 'store/actions/memberActions';
import '@material-design-icons/font';

interface DashboardProps {
  loyaltyId?: string;
}

export class Widget {
    tierInfo: any;
    totalSpends: number;
    nextTier: string;
    currentTier: string;
    nextMilestone: number;
    hemmingAvailable: number;
    streakBonus: number;
    pointBalance: number;
    tierBenefits: Array<{
        thumbnail: string;
        title: string;
        desc: string[];
    }>;

    constructor(widget: any) {
        this.tierInfo = widget?.data?.lineItems;
        this.totalSpends = widget?.data?.tierProgress ? widget?.data?.tierProgress.nonLinkedBal : 0;
        this.nextTier = widget?.data?.tierProgress ? widget.data?.tierProgress.nextTier : '';
        this.currentTier = widget?.data?.tierProgress ? widget.data?.tierProgress.currentTier : '';
        this.nextMilestone = widget?.data?.tierProgress ? widget.data?.tierProgress.nextMilestone : 0;
        this.pointBalance = (widget?.data?.pointBalance || widget?.data?.pointsBalance) ?? 0;
        this.hemmingAvailable = widget.data?.hemmingAvailable ?? 0;
        this.streakBonus = widget?.data?.streakBonus ?? '';
        this.tierBenefits = widget?.data?.tierBenefits ?? [];

        // if (widget?.data?.aggregates) {
        //     this.aggregates = widget?.data?.aggregates;
        // }
    }
}

// Add color constants
const colors = {
  encore: 'text-primary',
  ruby: 'text-purple-500',
  primary: 'text-primary',
  accent: 'text-accent',
  green: 'text-success',
  gray: 'text-text-secondary'
};

const Dashboard: React.FC<DashboardProps> = ({ loyaltyId = '1001' }) => {
  // Services
  const { getMember, getStreaks } = useMember();
  const { showError } = useAlert();
  const { getActivity, getStreakPolicy } = useActivity();
  const dispatch = useDispatch();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [widgetSkeleton, setWidgetSkeleton] = useState(true);
  const [streakSkeleton, setStreakSkeleton] = useState(true);
  const [widgetData, setWidgetData] = useState<Widget[]>([]);
  const [streaks, setStreaks] = useState<StreakPolicy[]>([]);
  const [selectedStreakCategory, setSelectedStreakCategory] = useState<StreaksCategory>(StreaksCategory.ACTIVE);
  const [providerPoints, setProviderPoints] = useState<any[]>([]);
  const [streakInfo, setStreakInfo] = useState<any>(null);
  const [steps, setSteps] = useState<StreakPolicy[]>([]);
  const [streakViewProgressSelections, setStreakViewProgressSelections] = useState<StreakProgressSelections>({
    previousTab: StreaksCategory.ACTIVE,
    viewProgressSelections: []
  });
  const member = useSelector((state: RootState) => state.member.member);

  const EXPIRED = 'Expired';
  const COMPLETE = 'Complete';
  const ACTIVE = 'Active';

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setIsLoading(true);
        setWidgetSkeleton(true);
        setStreakSkeleton(true);
        
        // Fetch member data
        loyaltyId = '1001';
        const memberData = await getMember(loyaltyId);
        if (memberData) {
          dispatch(addMember(memberData));
          console.log('Member data dispatched to Redux:', memberData);
        }

        // Get widget data
        const widgetPromises = Object.values(CouponEnum).map(val => {
          console.log(val, getActivityPayload(val));
          return getActivity(getActivityPayload(val));
        });
        const widgetResponses: Widget[] = await Promise.all(widgetPromises);
        const processedWidgets = widgetResponses.map(response => new Widget(response));
        setWidgetData(processedWidgets);
        setWidgetSkeleton(false);

        // Get streak policy
        const streakPolicyResponse = await getStreakPolicy();
        setStreakInfo(streakPolicyResponse);
        
        // Initialize steps
        const initializedSteps = streakPolicyResponse.map((data: any) => ({
          ...data,
          icon: 'pending',
          status: 'pending',
          timeRemaining: (data.timeLimit ?? 0) / 1440,
          rewards: data?.ext?.rewards ?? [],
          goals: data?.goalPolicies ?? []
        }));
        setSteps(initializedSteps);

        // Get streaks
        await getStreaksPR(GeneralConstants.streakProgress);

        // Get provider points
        if (memberData?.purses) {
          const points = memberData.purses
            .filter((purse: any) => !purse.name.includes('Status'))
            .map((purse: any) => ({
              provider: purse.name,
              balance: purse.availBalance
            }));
          setProviderPoints(points);
        }

      } catch (error) {
        showError(error instanceof Error ? error.message : 'Failed to initialize dashboard');
      } finally {
        setIsLoading(false);
        setStreakSkeleton(false);
      }
    };

    initializeDashboard();
  }, [loyaltyId]);

  const getActivityPayload = (coupon: string) => {
    return {
      type: coupon === GeneralConstants.streakProgress ? GeneralConstants.streakProgress : 'Personalization',
      date: new Date().toISOString(),
      srcChannelType: 'Web',
      couponCode: coupon === GeneralConstants.streakProgress ? member?.streaks?.[0]?._id || '' : coupon,
      srcChannelID: 'Corporate',
      loyaltyID: member?.loyaltyId || '1001'
    };
  };

  const getStreaksPR = async (code: string, isRefresh: boolean = false) => {
    try {
      setStreakSkeleton(true);
      const payload = {
        type: "Personalization",
        srcChannelType: "Web",
        srcChannelID: "Corporate",
        loyaltyID: member?.loyaltyId || '',
        couponCode: code,
        date: new Date().toISOString()
      };

      const response = await getActivity(payload);
      
      if (response.data?.streaksProgress?.length) {
        const updatedSteps = response.data.streaksProgress.map((sp: any) => ({
          ...sp.streak,
          goalCompleted: `${sp.goals.filter((a: any) => a.status === COMPLETE).length}/${sp.streak.noOfGoals}`,
          icon: getStatusIconName(sp.streak.status),
          goals: sp.goals,
          rewards: sp.streak.rewards ?? (sp.goals.length ? sp.goals.flatMap((a: any) => a.rewards) : []),
          streakId: sp.streakId
        }));
        
        setSteps(updatedSteps);
        
        if (!isRefresh) {
          selectStreakCategory(StreaksCategory.ACTIVE);
        } else {
          prepopulateStreakPrevInfo();
        }
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to fetch streaks');
    } finally {
      setStreakSkeleton(false);
    }
  };

  const selectStreakCategory = (category: StreaksCategory) => {
    setSelectedStreakCategory(category);
    setStreakViewProgressSelections(prev => ({
      ...prev,
      previousTab: category
    }));

    if (category === StreaksCategory.ENDED) {
      setStreaks(steps.filter(data => data.status === COMPLETE || data.status === EXPIRED));
    } else if (category === StreaksCategory.ACTIVE) {
      setStreaks(steps.filter(data => data.status === ACTIVE));
    } else {
      setStreaks(steps);
    }
  };

  const toggleViewProgress = (step: StreakPolicy, streakElemId: string) => {
    const updatedStep = { ...step, displayProgress: !step.displayProgress };
    setSteps(prevSteps => 
      prevSteps.map(s => s.streakId === step.streakId ? updatedStep : s)
    );

    setStreakViewProgressSelections(prev => ({
      ...prev,
      viewProgressSelections: step.displayProgress
        ? prev.viewProgressSelections.filter(id => id !== streakElemId)
        : [...prev.viewProgressSelections, streakElemId]
    }));
  };

  const prepopulateStreakPrevInfo = () => {
    setSelectedStreakCategory(streakViewProgressSelections.previousTab);
    selectStreakCategory(streakViewProgressSelections.previousTab);
    
    if (streakViewProgressSelections.viewProgressSelections.length) {
      setSteps(prevSteps => 
        prevSteps.map(step => ({
          ...step,
          displayProgress: streakViewProgressSelections.viewProgressSelections.includes(step?.streakId || '')
        }))
      );
    }
  };

  const getStatusIconName = (status: string) => {
    if (status === COMPLETE) {
      return 'check_circle';
    } else if (status === ACTIVE) {
      return 'check';
    } else if (status === EXPIRED) {
      return 'warning';
    } else {
      return 'pending';
    }
  };

  const streakOptinPR = async () => {
    try {
      setStreakSkeleton(true);
      const payload = {
        type: "Streak Optin",
        srcChannelType: "Web",
        srcChannelID: "Corporate",
        loyaltyID: member?.loyaltyId || '',
        couponCode: "Double Play Challenge",
        date: new Date().toISOString()
      };

      await getActivity(payload);
      await getStreaksPR(GeneralConstants.streakProgress);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to opt in to streak');
    } finally {
      setStreakSkeleton(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">Loading dashboard data...</h2>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <div className="container mx-auto px-5 py-6">
        <div className="flex flex-col gap-5 w-full">
          {!widgetSkeleton ? (
            <div className="flex gap-5">
              {/* Member Widget */}
              <div className="w-1/4 bg-white rounded-lg shadow p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col">
                    <p className="text-gray-600 text-base">Welcome back,</p>
                    <h1 className="text-2xl font-bold text-gray-900">{member?.firstName} {member?.lastName}</h1>
                  </div>
                  <div className="flex flex-col gap-5 mt-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                        <span className="material-icons text-orange-500">badge</span>
                      </div>
                      <div>
                        <small className="text-gray-500 text-sm block">Loyalty ID</small>
                        <div className="font-medium text-gray-900">{member?.loyaltyId}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                        <span className="material-icons text-orange-500">email</span>
                      </div>
                      <div>
                        <small className="text-gray-500 text-sm block">Email</small>
                        <div className="font-medium text-gray-900">{member?.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                        <span className="material-icons text-orange-500">phone</span>
                      </div>
                      <div>
                        <small className="text-gray-500 text-sm block">Phone</small>
                        <div className="font-medium text-gray-900">{member?.cellPhone}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tier Status Cards */}
              {widgetData.slice(0, 2).map((widget, index) => (
                <div className="w-1/4 bg-white rounded-lg shadow p-6" key={index}>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      {index === 0 ? 'Encore Tier Status' : 'GCGC Tier Status'}
                    </h3>
                    <div className="flex flex-col items-center">
                      <div className={`flex flex-col items-center ${index === 0 ? 'text-lime-500' : 'text-rose-600'}`}>
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 ${
                          index === 0 ? 'bg-lime-500' : 'bg-rose-600'
                        }`}>
                          <span className="material-icons text-white text-3xl">diamond</span>
                        </div>
                        <h2 className="text-xl font-bold mb-6">{widget.currentTier}</h2>
                      </div>
                      {widget.nextTier !== widget.currentTier ? (
                        <div className="w-full">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600">Progress to {widget.nextTier}</span>
                            <span className="text-sm font-medium text-gray-900">
                              {((widget.totalSpends / widget.nextMilestone) * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${index === 0 ? 'bg-lime-500' : 'bg-rose-600'}`}
                              style={{ width: `${(widget.totalSpends / widget.nextMilestone) * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">{widget.totalSpends.toLocaleString()} points</span>
                            <span className="text-sm text-gray-600">
                              {(widget.nextMilestone - widget.totalSpends).toLocaleString()} to next tier
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-green-600 text-center font-medium">
                          Congratulations! You have achieved<br />the Top Tier
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Points Balance Card */}
              <div className="w-1/4 bg-white rounded-lg shadow p-6">
                <div className="flex flex-col gap-6">
                  <h3 className="text-lg font-semibold text-gray-900">Points Balance</h3>
                  <div className="flex flex-col gap-4">
                    {providerPoints.map((provider, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="text-gray-600">{provider.provider}</div>
                        <div className="text-lg font-medium text-gray-900">{provider.balance.toLocaleString()} Points</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-5">
              {[1, 2, 3, 4].map((widget) => (
                <div className="w-1/2 bg-white rounded-lg shadow p-5" key={widget}>
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-5">
            {/* Tier Benefits Section */}
            <div className="w-1/2 bg-white rounded-lg shadow p-6">
              {!widgetSkeleton ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Tier Benefits</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {widgetData[2]?.tierBenefits?.map((benefit, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 transform transition-transform duration-200 hover:shadow-md">
                        <div className="flex flex-col h-full">
                          <div className="flex items-start gap-4 mb-3">
                            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                              <span className="material-icons text-orange-500">{benefit.thumbnail}</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-gray-900 font-semibold text-base leading-tight mb-1">
                                {benefit.title}
                              </h3>
                            </div>
                          </div>
                          <div className="text-gray-600 text-sm">
                            {benefit.desc.length === 1 ? (
                              <p className="mb-2">{benefit.desc[0]}</p>
                            ) : (
                              <ul className="list-disc pl-4 space-y-1">
                                {benefit.desc.map((desc, idx) => (
                                  <li key={idx}>{desc}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {[1, 2].map((row) => (
                    <div className="flex gap-4" key={row}>
                      {[1, 2].map((widget) => (
                        <div className="w-1/2 bg-gray-50 rounded-lg p-4" key={widget}>
                          <div className="animate-pulse">
                            <div className="flex gap-4 mb-4">
                              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                              <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-3 bg-gray-200 rounded w-full"></div>
                              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Encore Rewards Challenges Section */}
            <div className="w-1/2 bg-white rounded-lg shadow p-6">
              {!streakSkeleton ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">Encore Rewards Challenges</h3>
                      <button 
                        onClick={() => getStreaksPR(GeneralConstants.streakProgress, true)}
                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600"
                      >
                        <span className="material-icons text-xl">refresh</span>
                      </button>
                    </div>
                    <div className="flex gap-2">
                      {Object.values(StreaksCategory).map((category) => (
                        <button
                          key={category}
                          onClick={() => selectStreakCategory(category)}
                          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            selectedStreakCategory === category
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {streaks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="text-center text-gray-600 mb-6">
                        {selectedStreakCategory === StreaksCategory.ACTIVE ? (
                          <>
                            <p className="mb-1">You are currently not participating in any challenges</p>
                            <p>Join a challenge to start earning rewards!</p>
                          </>
                        ) : (
                          <p>You haven't completed any challenges yet</p>
                        )}
                      </div>
                      {selectedStreakCategory === StreaksCategory.ACTIVE && (
                        <button 
                          onClick={streakOptinPR}
                          className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                        >
                          Get Started
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {streaks.map((step, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-5">
                          <div className="flex gap-6">
                            {/* Left side - Progress */}
                            <div className="w-3/5">
                              <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-lg font-bold text-gray-900">{step.name}</h3>
                                <span className="text-2xl">🎪</span>
                              </div>
                              {!step.goals.length ? (
                                <div className="text-gray-600">{step.streakGoalMessage}</div>
                              ) : (
                                <div className="space-y-4">
                                  {step.goals.map((goal, goalIndex) => (
                                    <div key={goalIndex} className="space-y-2">
                                      <div className="flex items-center gap-3">
                                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                        <span className="font-medium text-gray-900">
                                          {goal.name}: {formatCurrency(goal.value || 0)}/{formatCurrency(goal.target)}
                                        </span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                                        <div 
                                          className="h-1.5 rounded-full bg-orange-500"
                                          style={{ width: `${((goal.value || 0) / goal.target) * 100}%` }}
                                        ></div>
                                      </div>
                                      {goal.instantBonus && (
                                        <div className="text-sm text-gray-600 pl-5">
                                          Bonus earned so far: {goal.instantBonus}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Right side - Info */}
                            <div className="w-2/5">
                              <p className="text-gray-600 text-sm mb-4">{step.desc}</p>
                              {step.startedAt && step.timeLimit && step.status === 'Active' && (
                                <div className="inline-block px-3 py-1 bg-gray-600 text-white text-sm rounded-full mb-4">
                                  <AppTimer startedAt={step.startedAt} timeLimit={step.timeLimit} />
                                </div>
                              )}
                              <div className="flex gap-3">
                                <div className="flex-1 bg-white rounded-lg p-3">
                                  <div className="text-sm text-gray-600 mb-1">Status</div>
                                  <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${
                                      step.status === 'Complete' ? 'bg-green-500' :
                                      step.status === 'Active' ? 'bg-orange-500' :
                                      'bg-red-500'
                                    }`}></span>
                                    <span className="font-semibold text-gray-900">
                                      {step.status === 'Complete' ? 'Completed' : step.status}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1 bg-white rounded-lg p-3">
                                  <div className="text-sm text-gray-600 mb-1">Goals</div>
                                  <div className="font-semibold text-gray-900">{step.goalCompleted}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  {[1, 2, 3].map((widget) => (
                    <div className="bg-gray-50 rounded-lg p-5" key={widget}>
                      <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 